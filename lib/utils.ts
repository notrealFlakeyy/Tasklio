import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amountInMinor: number,
  currency = "EUR",
  locale = "en-FI",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amountInMinor / 100);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formDataValue(
  value: FormDataEntryValue | null,
  fallback = "",
) {
  return typeof value === "string" ? value : fallback;
}

export function nullableString(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function parseTagInput(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}
