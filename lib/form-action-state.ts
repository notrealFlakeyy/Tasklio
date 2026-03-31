import type { ZodError } from "zod";

export type FormFieldErrors = Partial<Record<string, string>>;

export type FormActionState = {
  eventId: string | null;
  fieldErrors: FormFieldErrors;
  message: string | null;
  status: "error" | "idle" | "success";
};

export const INITIAL_FORM_ACTION_STATE: FormActionState = {
  eventId: null,
  fieldErrors: {},
  message: null,
  status: "idle",
};

function createEventId() {
  return crypto.randomUUID();
}

export function createErrorActionState(
  message: string,
  fieldErrors: FormFieldErrors = {},
): FormActionState {
  return {
    eventId: createEventId(),
    fieldErrors,
    message,
    status: "error",
  };
}

export function createSuccessActionState(message: string): FormActionState {
  return {
    eventId: createEventId(),
    fieldErrors: {},
    message,
    status: "success",
  };
}

export function getFieldErrorsFromZodError(error: ZodError): FormFieldErrors {
  const flattened = error.flatten().fieldErrors as Record<string, string[] | undefined>;

  return Object.fromEntries(
    Object.entries(flattened)
      .map(([key, value]) => [key, value?.[0]])
      .filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
}
