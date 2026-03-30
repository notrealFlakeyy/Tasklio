import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";
import { getServerEnv } from "@/lib/env";

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function createAdminClient(): any {
  if (!adminClient) {
    const env = getServerEnv();

    adminClient = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return adminClient as any;
}
