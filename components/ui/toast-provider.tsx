"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ToastTone = "error" | "success";

type ToastItem = {
  id: string;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function toastToneClassName(tone: ToastTone) {
  return tone === "success"
    ? "border-emerald-200 bg-emerald-50/95 text-emerald-950"
    : "border-rose-200 bg-rose-50/95 text-rose-950";
}

function ToastCard({
  message,
  onDismiss,
  tone,
}: {
  message: string;
  onDismiss: () => void;
  tone: ToastTone;
}) {
  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-[24px] border px-4 py-4 shadow-[0_20px_45px_rgba(68,55,48,0.12)] backdrop-blur-sm transition",
        toastToneClassName(tone),
      )}
      role="status"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
            {tone === "success" ? "Saved" : "Attention"}
          </p>
          <p className="mt-2 text-sm leading-6">{message}</p>
        </div>
        <button
          aria-label="Dismiss notification"
          className="text-sm font-semibold opacity-70 transition hover:opacity-100"
          onClick={onDismiss}
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();

    setToasts((current) => [...current, { ...toast, id }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-atomic="true"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:justify-end sm:px-6"
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          {toasts.map((toast) => (
            <ToastCard
              key={toast.id}
              message={toast.message}
              onDismiss={() =>
                setToasts((current) => current.filter((item) => item.id !== toast.id))
              }
              tone={toast.tone}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);

  if (!value) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return value;
}
