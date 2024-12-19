import type { TRPCContext } from "@/server/api/trpc";
import { createServerClient as _createServerClient } from "@supabase/ssr";
import type { Database } from "./db.types";
import { createClient as _createClient } from "@supabase/supabase-js";
import { env } from "@/env";

type Args = Pick<TRPCContext, "cookies">;

export const createServerClient = (opts: Args) => {
  return _createServerClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return opts.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              opts.cookies.set(name, value, {
                ...options,
                httpOnly: true,
                secure: true,
                sameSite: "lax",
              }),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};

export const createClient = () => {
  return _createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
};
