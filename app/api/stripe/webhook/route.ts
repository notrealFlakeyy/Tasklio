import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Stripe webhook stub. TODO: verify signatures, persist events, and sync organization_subscriptions.",
    },
    { status: 501 },
  );
}
