"use client";

import { useActionState } from "react";

import { idleActionState } from "@/lib/action-state";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpOwnerAction } from "@/modules/auth/actions";

type AuthSignUpFormProps = {
  defaultTimezone: string;
};

export function AuthSignUpForm({ defaultTimezone }: AuthSignUpFormProps) {
  const [state, formAction] = useActionState(signUpOwnerAction, idleActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Your name</Label>
          <Input id="fullName" name="fullName" placeholder="Alex Example" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="owner@example.com" required type="email" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="organizationName">Business name</Label>
          <Input
            id="organizationName"
            name="organizationName"
            placeholder="North Shore Clinic"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizationSlug">Public URL slug</Label>
          <Input
            id="organizationSlug"
            name="organizationSlug"
            placeholder="north-shore-clinic"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="timezone">Business timezone</Label>
          <Input id="timezone" name="timezone" required defaultValue={defaultTimezone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" minLength={8} name="password" required type="password" />
        </div>
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

      <SubmitButton pendingLabel="Creating account...">Create owner account</SubmitButton>
    </form>
  );
}
