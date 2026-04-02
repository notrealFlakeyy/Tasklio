"use client";

import { ActionForm } from "@/components/forms/action-form";
import { FieldError } from "@/components/forms/field-error";
import { FormNotice } from "@/components/forms/form-notice";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpOwnerAction } from "@/modules/auth/actions";

type AuthSignUpFormProps = {
  defaultTimezone: string;
};

export function AuthSignUpForm({ defaultTimezone }: AuthSignUpFormProps) {
  return (
    <ActionForm action={signUpOwnerAction} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Your name</Label>
          <Input id="fullName" name="fullName" placeholder="Alex Example" required />
          <FieldError name="fullName" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="owner@example.com" required type="email" />
          <FieldError name="email" />
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
          <FieldError name="organizationName" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizationSlug">Booking page name</Label>
          <Input id="organizationSlug" name="organizationSlug" placeholder="Optional" />
          <FieldError name="organizationSlug" />
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Leave this blank and we will create it from your business name.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="timezone">Business timezone</Label>
          <Input id="timezone" name="timezone" required defaultValue={defaultTimezone} />
          <FieldError name="timezone" />
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            If you are unsure, leave this as it is.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" minLength={8} name="password" required type="password" />
          <FieldError name="password" />
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Use at least 8 characters.
          </p>
        </div>
      </div>

      <FormNotice successLabel="Almost there." />

      <SubmitButton pendingLabel="Creating workspace...">Create workspace</SubmitButton>
    </ActionForm>
  );
}
