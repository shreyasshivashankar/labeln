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

  // Verify the Supabase JWT and extract the user
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
    .eq('user_id', user.id);

  if (error || !data) {
    return NextResponse.json({ error: 'Measurements not found' }, { status: 404 });
  }

  const first = data[0];
  if (!first) {
    return NextResponse.json({ error: 'Measurements not found' }, { status: 404 });
  }

  return NextResponse.json(first);
}
