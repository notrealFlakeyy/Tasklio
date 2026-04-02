import { renderToStaticMarkup } from "react-dom/server";

import { getServerEnv } from "@/lib/env";
import {
  renderBookingConfirmedCustomerEmail,
  renderBookingCreatedCustomerEmail,
  renderBookingCreatedOwnerEmail,
} from "@/lib/notifications/email-templates";
import type {
  NotificationEmailBranding,
  RenderNotificationEmailInput,
  RenderedNotificationEmail,
} from "@/lib/notifications/email-template-types";

function withAbsoluteLogoUrl(branding: NotificationEmailBranding): NotificationEmailBranding {
  if (branding.logoUrl.startsWith("http://") || branding.logoUrl.startsWith("https://")) {
    return branding;
  }

  const env = getServerEnv();
  const path = branding.logoUrl.startsWith("/") ? branding.logoUrl : `/${branding.logoUrl}`;

  return {
    ...branding,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    logoUrl: `${env.NEXT_PUBLIC_APP_URL}${path}`,
  };
}

export function renderNotificationEmail(
  input: RenderNotificationEmailInput,
): RenderedNotificationEmail {
  const normalizedInput = {
    ...input,
    branding: withAbsoluteLogoUrl(input.branding),
  };

  const rendered =
    normalizedInput.templateKey === "booking.created.customer"
      ? renderBookingCreatedCustomerEmail(normalizedInput)
      : normalizedInput.templateKey === "booking.created.owner"
        ? renderBookingCreatedOwnerEmail(normalizedInput)
        : renderBookingConfirmedCustomerEmail(normalizedInput);

  return {
    ...rendered,
    html: `<!DOCTYPE html>${renderToStaticMarkup(rendered.body)}`,
  };
}
