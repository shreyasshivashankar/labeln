/**
 * Browser-side Supabase client (anon key).
 * Used for auth (sign in / sign up / session) and RLS-scoped queries.
 * Server-only admin operations use lib/supabaseAdmin.ts instead.
 *
 * Lazily initialized to avoid crashing during SSR/build when env vars are missing.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  _client = createClient(url, anonKey);
  return _client;
}
