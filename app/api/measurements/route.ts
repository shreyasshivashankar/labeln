import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '../../../lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const {
    data: { user },
    error: authError,
  } = await db.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await db
    .from('measurements')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch measurements' }, { status: 500 });
  }

  const record = data?.[0];
  if (!record) {
    return NextResponse.json({ error: 'Measurements not found' }, { status: 404 });
  }

  return NextResponse.json(record);
}
