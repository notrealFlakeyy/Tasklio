import type { CSSProperties } from "react";

import type { Tables } from "@/lib/database.types";

type OrganizationBrandingSource = Pick<
  Tables<"organizations">,
  | "brand_accent_color"
  | "brand_alt_color"
  | "brand_logo_url"
  | "brand_primary_color"
  | "brand_surface_color"
  | "name"
  | "public_description"
  | "public_headline"
  | "public_tagline"
>;

export type OrganizationBranding = {
  accentColor: string;
  altColor: string;
  description: string;
  headline: string;
  logoNeedsContrastPanel: boolean;
  logoUrl: string | null;
  primaryColor: string;
  surfaceColor: string;
  tagline: string;
};

function normalizeHexColor(value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();

  return /^#[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed.toLowerCase() : fallback;
}

function trimOrNull(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function hexToRgb(hex: string) {
  const sanitized = hex.replace("#", "");

  return {
    b: Number.parseInt(sanitized.slice(4, 6), 16),
    g: Number.parseInt(sanitized.slice(2, 4), 16),
    r: Number.parseInt(sanitized.slice(0, 2), 16),
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getOrganizationBranding(
  organization: OrganizationBrandingSource,
): OrganizationBranding {
  const primaryColor = normalizeHexColor(organization.brand_primary_color, "#443730");
  const accentColor = normalizeHexColor(organization.brand_accent_color, "#786452");
  const surfaceColor = normalizeHexColor(organization.brand_surface_color, "#eaf7cf");
  const altColor = normalizeHexColor(organization.brand_alt_color, "#e6fdff");

  return {
    accentColor,
    altColor,
    description:
      trimOrNull(organization.public_description) ??
      `Choose a service, see real availability, and confirm everything through a booking flow that feels considered instead of transactional.`,
    headline:
      trimOrNull(organization.public_headline) ??
      `A calmer way to book with ${organization.name}.`,
    logoNeedsContrastPanel:
      (trimOrNull(organization.brand_logo_url) ?? "/branding/clientflow_logo_black.png").includes(
        "clientflow_logo_black",
      ),
    logoUrl: trimOrNull(organization.brand_logo_url) ?? "/branding/clientflow_logo_black.png",
    primaryColor,
    surfaceColor,
    tagline: trimOrNull(organization.public_tagline) ?? "Book with confidence",
  };
}

export function buildPublicBrandingStyle(
  branding: OrganizationBranding,
): CSSProperties {
  return {
    "--background-soft": branding.surfaceColor,
    "--background-alt": branding.altColor,
    "--color-border": rgba(branding.accentColor, 0.18),
    "--color-border-strong": rgba(branding.accentColor, 0.32),
    "--color-brand": branding.accentColor,
    "--color-brand-soft": rgba(branding.altColor, 0.84),
    "--color-brand-strong": branding.primaryColor,
    "--color-highlight": rgba(branding.surfaceColor, 0.9),
    "--color-ink": branding.primaryColor,
    "--color-muted": rgba(branding.primaryColor, 0.72),
    "--color-ring": rgba(branding.accentColor, 0.24),
    "--text-strong": branding.primaryColor,
  } as CSSProperties;
}
