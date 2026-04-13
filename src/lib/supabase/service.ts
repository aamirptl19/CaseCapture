import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses RLS.
 * Used ONLY in trusted Server Actions (e.g. saving a public intake submission).
 * NEVER expose this client or key to the browser.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
