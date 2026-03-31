"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function SubmitButton({
  children,
  pendingLabel = "Saving...",
  variant = "primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-live="polite"
      disabled={pending}
      type="submit"
      variant={variant}
    >
      {pending ? (
        <>
          <span className="inline-flex items-center gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70 animate-[pulse_1s_ease-in-out_infinite]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50 animate-[pulse_1s_ease-in-out_infinite] [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40 animate-[pulse_1s_ease-in-out_infinite] [animation-delay:300ms]" />
          </span>
          <span>{pendingLabel}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
