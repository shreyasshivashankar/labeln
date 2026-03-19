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

/** GET /api/admin/measurements?email=... */
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }

  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { data, error } = await db
    .from('measurements')
    .select('*')
    .eq('customer_email', email.toLowerCase())
    .order('updated_at', { ascending: false })
    .limit(1);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch measurements' }, { status: 500 });
  }

  return NextResponse.json({ measurement: data?.[0] ?? null });
}

/** POST /api/admin/measurements — create or update */
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const body = await request.json();
  const { customer_email, customer_name, values, custom_fields, notes } = body;

  if (!customer_email) {
    return NextResponse.json({ error: 'customer_email is required' }, { status: 400 });
  }

  const email = customer_email.toLowerCase();

  // Check if record already exists for this customer
  const { data: existing } = await db
    .from('measurements')
    .select('id')
    .eq('customer_email', email)
    .limit(1);

  const existingRecord = existing?.[0];
  if (existingRecord) {
    const { data, error } = await db
      .from('measurements')
      .update({
        customer_name: customer_name || null,
        values: values || {},
        custom_fields: custom_fields || [],
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingRecord.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update measurements' }, { status: 500 });
    }

    return NextResponse.json({ measurement: data, action: 'updated' });
  }

  const { data, error } = await db
    .from('measurements')
    .insert({
      customer_email: email,
      customer_name: customer_name || null,
      values: values || {},
      custom_fields: custom_fields || [],
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create measurements' }, { status: 500 });
  }

  return NextResponse.json({ measurement: data, action: 'created' });
}
