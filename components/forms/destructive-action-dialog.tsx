"use client";

import { useEffect, useState } from "react";

import { ActionForm, useActionFormState } from "@/components/forms/action-form";
import { FormNotice } from "@/components/forms/form-notice";
import { SubmitButton } from "@/components/forms/submit-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { FormActionState } from "@/lib/form-action-state";

type DestructiveActionDialogProps = {
  action: (state: FormActionState, formData: FormData) => Promise<FormActionState>;
  confirmLabel: string;
  description: string;
  fieldName: string;
  fieldValue: string;
  pendingLabel?: string;
  title: string;
  triggerLabel: string;
};

function DialogStateWatcher({ onSuccess }: { onSuccess: () => void }) {
  const state = useActionFormState();

  useEffect(() => {
    if (state.status === "success") {
      onSuccess();
    }
  }, [onSuccess, state.status]);

  return null;
}

export function DestructiveActionDialog({
  action,
  confirmLabel,
  description,
  fieldName,
  fieldValue,
  pendingLabel = "Saving...",
  title,
  triggerLabel,
}: DestructiveActionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild>
        <Button variant="danger">{triggerLabel}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <ActionForm action={action} className="space-y-5" toastMode="all">
          <DialogStateWatcher onSuccess={() => setOpen(false)} />
          <input name={fieldName} type="hidden" value={fieldValue} />

          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>

          <FormNotice successLabel="Done." />

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="ghost">Keep it</Button>
            </AlertDialogCancel>
            <SubmitButton pendingLabel={pendingLabel} variant="danger">
              {confirmLabel}
            </SubmitButton>
          </AlertDialogFooter>
        </ActionForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
