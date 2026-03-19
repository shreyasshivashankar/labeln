import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '../../../lib/supabaseAdmin';

function isAdminAuthorized(request: NextRequest): boolean {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  return token === process.env.ADMIN_SECRET;
}

/** GET /api/measurements?order_id=... — admin only, fetch by order */
export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orderId = request.nextUrl.searchParams.get('order_id');
  if (!orderId) {
    return NextResponse.json({ error: 'order_id parameter required' }, { status: 400 });
  }

  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { data, error } = await db
    .from('measurements')
    .select('*')
    .eq('shopify_order_id', orderId)
    .limit(1);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch measurements' }, { status: 500 });
  }

  return NextResponse.json({ measurement: data?.[0] ?? null });
}
