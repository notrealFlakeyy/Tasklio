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
          <Label htmlFor="organizationSlug">Public URL slug</Label>
          <Input
            id="organizationSlug"
            name="organizationSlug"
            placeholder="clientflow-demo"
          />
          <FieldError name="organizationSlug" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="timezone">Business timezone</Label>
          <Input id="timezone" name="timezone" required defaultValue={defaultTimezone} />
          <FieldError name="timezone" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" minLength={8} name="password" required type="password" />
          <FieldError name="password" />
        </div>
      </div>

      <FormNotice successLabel="Almost there." />

      <SubmitButton pendingLabel="Creating account...">Create ClientFlow workspace</SubmitButton>
    </ActionForm>
  );
}
