"use client";

import { useActionFormState } from "@/components/forms/action-form";
import { cn } from "@/lib/utils";

export function FormNotice({
  className,
  successLabel,
}: {
  className?: string;
  successLabel?: string;
}) {
  const state = useActionFormState();

  if (state.status === "idle" || !state.message) {
    return null;
  }

  const isSuccess = state.status === "success";

  return (
    <div
      className={cn(
        "rounded-[20px] border px-4 py-3 text-sm leading-6",
        isSuccess
          ? "border-emerald-200 bg-emerald-50/90 text-emerald-950"
          : "border-rose-200 bg-rose-50/90 text-rose-950",
        className,
      )}
      role={isSuccess ? "status" : "alert"}
    >
      <span className="font-semibold">{isSuccess ? successLabel ?? "Saved." : "Unable to save."}</span>{" "}
      <span>{state.message}</span>
    </div>
  );
}
