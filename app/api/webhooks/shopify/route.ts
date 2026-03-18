/**
 * Shopify webhook ingestion pipeline.
 * Handles: orders/create, orders/updated, customers/update, products/*
 *
 * Security:
 *   - HMAC-SHA256 verification prevents spoofing (timing-safe comparison)
 *   - Service-role Supabase client bypasses RLS — correct for server-to-server sync
 *
 * Cache invalidation:
 *   - Products webhooks call revalidateTag() directly (automated, event-driven)
 *   - /api/revalidate is a separate "break glass" endpoint for manual purges
 *     (e.g. CI pipelines or admin dashboards). Intentional split — see REVALIDATE_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { revalidateTag } from 'next/cache';
import { getAdminClient } from '../../../../lib/supabaseAdmin';
import { logEvent, logError } from '../../../../lib/logger';

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

function verifyHmac(body: string, hmacHeader: string | null): boolean {
  if (!WEBHOOK_SECRET || !hmacHeader) return false;
  const hash = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'base64'), Buffer.from(hmacHeader, 'base64'));
  } catch {
    return false;
  }
}

async function handleProductsUpdate(body: { id?: string; admin_graphql_api_id?: string }) {
  const productId = body.admin_graphql_api_id ?? body.id;
  if (productId) {
    const gid = typeof productId === 'string' ? productId : String(productId);
    const numericId = gid.replace(/\D/g, '');
    revalidateTag(`product-${numericId}`, 'max');
    revalidateTag('products', 'max');
  }
  revalidateTag('shopify', 'max');
}

async function handleOrderCreate(body: Record<string, unknown>) {
  // Idempotency key: Shopify order id. The orders table has a UNIQUE constraint on order_id.
  const orderId = String(body.admin_graphql_api_id ?? body.id ?? '');
  if (!orderId) return;

  const db = getAdminClient();
  if (!db) {
    logEvent('WebhookSkippedNoDB', { reason: 'Supabase not configured', orderId });
    return;
  }

  const shopifyCustomerId = body.customer
    ? String((body.customer as Record<string, unknown>).id ?? '')
    : null;

  const { error } = await db.from('orders').upsert(
    {
      order_id: orderId,
      shopify_order_id: orderId,
      shopify_customer_id: shopifyCustomerId,
      total_price: body.total_price ?? null,
      status: body.financial_status ?? 'pending',
      raw_payload: body,
    },
    { onConflict: 'order_id' }
  );

  if (error) {
    throw new Error(`Failed to upsert order ${orderId}: ${error.message}`);
  }

  logEvent('OrderCreated', { orderId, shopifyCustomerId });
}

async function handleOrderUpdated(body: Record<string, unknown>) {
  const orderId = String(body.admin_graphql_api_id ?? body.id ?? '');
  if (!orderId) return;

  const db = getAdminClient();
  if (!db) {
    logEvent('WebhookSkippedNoDB', { reason: 'Supabase not configured', orderId });
    return;
  }

  const { error } = await db
    .from('orders')
    .update({
      status: body.financial_status ?? body.fulfillment_status ?? 'updated',
      raw_payload: body,
    })
    .eq('order_id', orderId);

  if (error) {
    throw new Error(`Failed to update order ${orderId}: ${error.message}`);
  }

  logEvent('OrderUpdated', { orderId });
}

async function handleCustomerUpdate(body: Record<string, unknown>) {
  const customerId = String(body.admin_graphql_api_id ?? body.id ?? '');
  const email = typeof body.email === 'string' ? body.email : null;
  if (!customerId || !email) return;

  const db = getAdminClient();
  if (!db) {
    logEvent('WebhookSkippedNoDB', { reason: 'Supabase not configured', customerId });
    return;
  }

  // Identity mapping: link our user record to their Shopify customer ID.
  // Uses upsert on email so this is safe to run multiple times.
  const { error } = await db
    .from('users')
    .update({ shopify_customer_id: customerId })
    .eq('email', email);

  if (error) {
    throw new Error(`Failed to update customer ${customerId}: ${error.message}`);
  }

  logEvent('CustomerUpdated', { customerId, email });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const hmac = request.headers.get('x-shopify-hmac-sha256');
  const topic = request.headers.get('x-shopify-topic');

  if (!verifyHmac(rawBody, hmac)) {
    return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    switch (topic) {
      case 'products/update':
      case 'products/create':
        await handleProductsUpdate(body as { id?: string; admin_graphql_api_id?: string });
        break;
      case 'orders/create':
        await handleOrderCreate(body);
        break;
      case 'orders/updated':
        await handleOrderUpdated(body);
        break;
      case 'customers/update':
        await handleCustomerUpdate(body);
        break;
      default:
        logEvent('WebhookReceived', { topic: topic ?? 'unknown' });
    }
  } catch (err) {
    logError('WebhookError', err, { topic: topic ?? 'unknown' });
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
