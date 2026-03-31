"use client";

import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";

import {
  INITIAL_FORM_ACTION_STATE,
  type FormActionState,
} from "@/lib/form-action-state";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-provider";

type ActionFormProps = Omit<ComponentPropsWithoutRef<"form">, "action"> & {
  action: (
    state: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  toastMode?: "all" | "error" | "none" | "success";
};

const ActionFormContext = createContext<FormActionState>(INITIAL_FORM_ACTION_STATE);

export function ActionForm({
  action,
  children,
  className,
  toastMode = "all",
  ...props
}: ActionFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_FORM_ACTION_STATE);
  const { pushToast } = useToast();
  const lastEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!state.eventId || state.eventId === lastEventIdRef.current || !state.message) {
      return;
    }

    const shouldToast =
      toastMode === "all" ||
      (toastMode === "success" && state.status === "success") ||
      (toastMode === "error" && state.status === "error");

    if (shouldToast) {
      pushToast({
        message: state.message,
        tone: state.status === "success" ? "success" : "error",
      });
    }

    lastEventIdRef.current = state.eventId;
  }, [pushToast, state, toastMode]);

  return (
    <ActionFormContext.Provider value={state}>
      <form action={formAction} className={cn(className)} {...props}>
        {children}
      </form>
    </ActionFormContext.Provider>
  );
}

export function useActionFormState() {
  return useContext(ActionFormContext);
}
