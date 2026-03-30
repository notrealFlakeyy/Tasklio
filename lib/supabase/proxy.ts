import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/database.types";
import { getServerEnv } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  const env = getServerEnv();
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const pathname = request.nextUrl.pathname;
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname === "/auth/sign-in" || pathname === "/auth/sign-up";

  if (isDashboardRoute && !claims) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/sign-in";
    redirectUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && claims) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
