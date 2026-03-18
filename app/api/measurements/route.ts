import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { supabase } from '../../../lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  const session: { user?: { id?: string } } | null = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .eq('user_id', session.user.id);

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: 'Measurements not found' }, { status: 404 });
  }

  const first = data[0];
  if (!first) {
    return NextResponse.json({ error: 'Measurements not found' }, { status: 404 });
  }

  return NextResponse.json(first);
}
