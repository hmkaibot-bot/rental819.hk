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
let catalogueCached: SupabaseClient | null = null;

/**
 * Read client for the public bike catalogue.
 * Prefers the anon key so a public page never needs the service role.
 * Falls back to the service role when that is all the deployment has configured.
 */
export function supabaseCatalogue(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anon) {
    if (!catalogueCached) {
      catalogueCached = createClient(url, anon, {
        auth: { persistSession: false },
        global: {
          fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
        },
      });
    }
    return catalogueCached;
  }
  if (isSupabaseConfigured()) return supabaseAdmin();
  return null;
}

/** Server-only client using the service-role key (bypasses RLS). */
export function supabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  if (!cached) {
    cached = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false },
        // Every read must hit Postgres: the back-office shows what staff just
        // saved, so Next's fetch Data Cache is never allowed to answer here.
        global: {
          fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
        },
      },
    );
  }
  return cached;
}
