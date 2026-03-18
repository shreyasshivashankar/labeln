/**
 * Server-only Supabase admin client.
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass Row Level Security — for
 * background jobs and webhook handlers only. Never import in client code.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Returns null when Supabase is not configured (development / CI without real creds).
 * Callers must check for null and skip DB writes gracefully.
 */
export function getAdminClient() {
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
