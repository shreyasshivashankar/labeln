/**
 * On-demand revalidation for cache invalidation.
 * Called by Shopify products/update webhook to purge product cache.
 * Secured with secret token - only internal/webhook callers should use this.
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (REVALIDATE_SECRET && token !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tag } = (await request.json().catch(() => ({}))) as { tag?: string };

  if (!tag) {
    return NextResponse.json(
      { revalidated: false, message: 'Missing tag' },
      { status: 400 }
    );
  }

  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, tag });
}
