import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type Env = { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };

// Uses the fetch-based Supabase client (PostgREST over HTTP) instead of a raw
// Postgres/TCP connection — Cloudflare Workers support fetch natively, so this
// sidesteps the native-engine/WASM issues that Prisma hits on Workers.
export const getSupabase = cache(() => {
  const { env } = getCloudflareContext();
  const e = env as unknown as Env;
  return createClient(e.SUPABASE_URL, e.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
});
