import type { ReactElement } from "react";

export type NotificationTemplateKey =
  | "booking.confirmed.customer"
  | "booking.created.customer"
  | "booking.created.owner";

export type NotificationEmailBranding = {
  accentColor: string;
  appUrl: string;
  logoUrl: string;
  organizationName: string;
  supportEmail: string | null;
};

export type NotificationEmailData = {
  bookingDateLabel?: string | null;
  bookingId: string;
  bookingTimeLabel?: string | null;
  bookingUrl?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
  ownerName?: string | null;
  serviceName?: string | null;
};

export type RenderNotificationEmailInput = {
  branding: NotificationEmailBranding;
  data: NotificationEmailData;
  templateKey: NotificationTemplateKey;
};

export type RenderedNotificationEmail = {
  body: ReactElement;
  html: string;
  subject: string;
  text: string;
};
