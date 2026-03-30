"use client";

import Link from "next/link";
import { useActionState } from "react";

import { idleActionState } from "@/lib/action-state";
import { signInAction } from "@/modules/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/forms/submit-button";

type AuthSignInFormProps = {
  next?: string;
};

export function AuthSignInForm({ next }: AuthSignInFormProps) {
  const [state, formAction] = useActionState(signInAction, idleActionState);

  return (
    <form action={formAction} className="space-y-5">
      <input name="next" type="hidden" value={next ?? "/dashboard"} />

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" placeholder="owner@example.com" required type="email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" minLength={8} name="password" required type="password" />
      </div>

      {state.message ? (
        <p
          className={
            state.status === "error"
              ? "text-sm text-[var(--color-danger)]"
              : "text-sm text-[var(--color-success)]"
          }
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton pendingLabel="Signing in...">Sign in</SubmitButton>

      <p className="text-sm text-[var(--color-muted)]">
        No account yet?{" "}
        <Link className="font-semibold text-[var(--color-brand)]" href="/auth/sign-up">
          Create one
        </Link>
      </p>
    </form>
  );
}
