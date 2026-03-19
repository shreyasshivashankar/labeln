/**
 * Browser-side Supabase client (anon key).
 * Used for auth (sign in / sign up / session) and RLS-scoped queries.
 * Server-only admin operations use lib/supabaseAdmin.ts instead.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for auth.'
  );
}

export const supabase = createClient(url ?? '', anonKey ?? '');
