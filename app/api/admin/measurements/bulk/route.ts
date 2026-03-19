import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getAdminClient } from '@/lib/supabaseAdmin';

const SECRET = new TextEncoder().encode(process.env.ADMIN_SECRET || 'dev-secret');

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

/** POST /api/admin/measurements/bulk — get status for multiple orders */
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { order_ids } = await request.json();
  if (!Array.isArray(order_ids) || order_ids.length === 0) {
    return NextResponse.json({ records: [] });
  }

  const { data, error } = await db
    .from('measurements')
    .select('shopify_order_id, status, values')
    .in('shopify_order_id', order_ids);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }

  return NextResponse.json({ records: data ?? [] });
}
