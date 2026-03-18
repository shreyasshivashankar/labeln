/**
 * Shopify webhook ingestion pipeline.
 * Handles: orders/create, orders/updated, customers/update
 * - HMAC verification to prevent spoofing
 * - Idempotent handlers (no duplicate records on retries)
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { revalidateTag } from 'next/cache';

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
  // Idempotency: use order id as deduplication key
  const orderId = body.id ?? body.admin_graphql_api_id;
  if (!orderId) return;

  // In production: upsert to Supabase orders table with order_id as unique constraint
  // await supabase.from('orders').upsert({ ... }, { onConflict: 'order_id' })
  console.info(
    JSON.stringify({
      event: 'OrderCreated',
      orderId,
      timestamp: new Date().toISOString(),
    })
  );
}

async function handleOrderUpdated(body: Record<string, unknown>) {
  const orderId = body.id ?? body.admin_graphql_api_id;
  if (!orderId) return;

  console.info(
    JSON.stringify({
      event: 'OrderUpdated',
      orderId,
      timestamp: new Date().toISOString(),
    })
  );
}

async function handleCustomerUpdate(body: Record<string, unknown>) {
  const customerId = body.id ?? body.admin_graphql_api_id;
  if (!customerId) return;

  // Identity mapping: update Supabase user with shopify_customer_id
  // await supabase.from('users').update({ shopify_customer_id: customerId }).eq('email', body.email)
  console.info(
    JSON.stringify({
      event: 'CustomerUpdated',
      customerId,
      timestamp: new Date().toISOString(),
    })
  );
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
        console.info(JSON.stringify({ event: 'WebhookReceived', topic, timestamp: new Date().toISOString() }));
    }
  } catch (err) {
    console.error(JSON.stringify({ event: 'WebhookError', topic, error: String(err) }));
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
