"use client";

import Link from "next/link";

import { ActionForm } from "@/components/forms/action-form";
import { FieldError } from "@/components/forms/field-error";
import { FormNotice } from "@/components/forms/form-notice";
import { SubmitButton } from "@/components/forms/submit-button";
import { signInAction } from "@/modules/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthSignInFormProps = {
  next?: string;
};

export function AuthSignInForm({ next }: AuthSignInFormProps) {
  return (
    <ActionForm action={signInAction} className="space-y-5" toastMode="error">
      <input name="next" type="hidden" value={next ?? "/dashboard"} />

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" placeholder="owner@example.com" required type="email" />
        <FieldError name="email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" minLength={8} name="password" required type="password" />
        <FieldError name="password" />
      </div>

      <FormNotice successLabel="Signed in." />

      <SubmitButton pendingLabel="Signing in...">Sign in</SubmitButton>

      <p className="text-sm text-[var(--color-muted)]">
        No account yet?{" "}
        <Link className="font-semibold text-[var(--color-brand)]" href="/auth/sign-up">
          Create a ClientFlow workspace
        </Link>
      </p>
    </ActionForm>
  );
}
