"use client";

import { useActionFormState } from "@/components/forms/action-form";

export function FieldError({ name }: { name: string }) {
  const state = useActionFormState();
  const message = state.fieldErrors[name];

  if (!message) {
    return null;
  }

  return <p className="text-sm text-[var(--color-danger)]">{message}</p>;
}
