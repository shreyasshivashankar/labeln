/**
 * Shopify webhook handler.
 * Handles: products/* (cache invalidation)
 *
 * Security:
 *   - HMAC-SHA256 verification prevents spoofing (timing-safe comparison)
 *
 * Note: Orders and customers are managed in Shopify directly.
 * Supabase is only used for custom order measurements (via /admin).
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

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const hmac = request.headers.get('x-shopify-hmac-sha256');
  const topic = request.headers.get('x-shopify-topic');

  if (!verifyHmac(rawBody, hmac)) {
    return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 });
  }

  // Product changes → invalidate cache so pages reflect updated data
  if (topic?.startsWith('products/')) {
    revalidateTag('shopify', 'max');
  }

  return NextResponse.json({ received: true });
}
