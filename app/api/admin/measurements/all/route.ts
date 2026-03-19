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

/** GET /api/admin/measurements/all — list all measurement records */
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { data, error } = await db
    .from('measurements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }

  return NextResponse.json({ records: data ?? [] });
}
