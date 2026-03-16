import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config.js";
import type { Database } from "./types.js";

/**
 * Creates a Supabase client scoped to a specific user session.
 * Respects Row Level Security — the user can only access their own data.
 */
export function createSupabaseClient(
  accessToken?: string,
): SupabaseClient<Database> {
  return createClient<Database>(
    config.supabaseUrl,
    config.supabaseAnonKey,
    accessToken
      ? {
          global: {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        }
      : undefined,
  );
}

/**
 * Admin client using the service_role key — bypasses RLS.
 * Use only for backend operations: cache writes, embedding management, MCP server config.
 */
export const supabaseAdmin = createClient<Database>(
  config.supabaseUrl,
  config.supabaseServiceRoleKey,
);
