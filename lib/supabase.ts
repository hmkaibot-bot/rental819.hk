import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Is a Supabase backend configured? When false the app runs in demo mode
 * (in-memory sample data) so the admin UI is fully viewable without a DB.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

let cached: SupabaseClient | null = null;

/** Server-only client using the service-role key (bypasses RLS). */
export function supabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  if (!cached) {
    cached = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    );
  }
  return cached;
}
