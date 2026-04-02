import {
  EmailBodyText,
  EmailButton,
  EmailDetailCard,
  EmailDetailRow,
  EmailLayout,
} from "@/lib/notifications/email-layout";
import type {
  NotificationEmailData,
  RenderNotificationEmailInput,
  RenderedNotificationEmail,
} from "@/lib/notifications/email-template-types";

function bookingSummary(data: NotificationEmailData) {
  return (
    <EmailDetailCard>
      {data.serviceName ? (
        <EmailDetailRow label="Service" value={data.serviceName} />
      ) : null}
      {data.bookingDateLabel ? (
        <EmailDetailRow label="Date" value={data.bookingDateLabel} />
      ) : null}
      {data.bookingTimeLabel ? (
        <EmailDetailRow label="Time" value={data.bookingTimeLabel} />
      ) : null}
      <EmailDetailRow label="Booking reference" value={data.bookingId} />
    </EmailDetailCard>
  );
}

export function renderBookingCreatedCustomerEmail({
  branding,
  data,
}: RenderNotificationEmailInput): RenderedNotificationEmail {
  const subject = `Booking request received by ${branding.organizationName}`;
  const title = "Your booking request is in";
  const preview = `${branding.organizationName} received your booking request.`;
  const body = (
    <EmailLayout branding={branding} preview={preview} title={title}>
      <EmailBodyText>
        Hi {data.customerName ?? "there"}, thanks for booking with{" "}
        {branding.organizationName}. Your request is now in the system and will
        be reviewed shortly.
      </EmailBodyText>
      <EmailBodyText>
        We&apos;ve included the details below so everything feels clear from the start.
      </EmailBodyText>
      {bookingSummary(data)}
      {data.bookingUrl ? (
        <EmailButton
          accentColor={branding.accentColor}
          href={data.bookingUrl}
          label="Open booking page"
        />
      ) : null}
    </EmailLayout>
  );

  const text = [
    `Hi ${data.customerName ?? "there"},`,
    "",
    `Your booking request with ${branding.organizationName} has been received.`,
    data.serviceName ? `Service: ${data.serviceName}` : null,
    data.bookingDateLabel ? `Date: ${data.bookingDateLabel}` : null,
    data.bookingTimeLabel ? `Time: ${data.bookingTimeLabel}` : null,
    `Booking reference: ${data.bookingId}`,
    data.bookingUrl ? `Booking page: ${data.bookingUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return { body, html: "", subject, text };
}

export function renderBookingCreatedOwnerEmail({
  branding,
  data,
}: RenderNotificationEmailInput): RenderedNotificationEmail {
  const subject = `New booking request for ${branding.organizationName}`;
  const title = "A new booking needs your attention";
  const preview = `A new client booking has been created for ${branding.organizationName}.`;
  const body = (
    <EmailLayout branding={branding} preview={preview} title={title}>
      <EmailBodyText>
        {data.customerName ?? "A client"} just requested a booking with{" "}
        {branding.organizationName}.
      </EmailBodyText>
      <EmailBodyText>
        This is a good moment to confirm the booking, review any notes, and
        follow up if the client needs anything before the appointment.
      </EmailBodyText>
      {bookingSummary(data)}
    </EmailLayout>
  );

  const text = [
    "A new booking request was created.",
    data.customerName ? `Customer: ${data.customerName}` : null,
    data.customerEmail ? `Email: ${data.customerEmail}` : null,
    data.serviceName ? `Service: ${data.serviceName}` : null,
    data.bookingDateLabel ? `Date: ${data.bookingDateLabel}` : null,
    data.bookingTimeLabel ? `Time: ${data.bookingTimeLabel}` : null,
    `Booking reference: ${data.bookingId}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { body, html: "", subject, text };
}

export function renderBookingConfirmedCustomerEmail({
  branding,
  data,
}: RenderNotificationEmailInput): RenderedNotificationEmail {
  const subject = `Your booking is confirmed with ${branding.organizationName}`;
  const title = "Your booking is confirmed";
  const preview = `${branding.organizationName} confirmed your upcoming booking.`;
  const body = (
    <EmailLayout branding={branding} preview={preview} title={title}>
      <EmailBodyText>
        Hi {data.customerName ?? "there"}, your booking with {branding.organizationName} is now confirmed.
      </EmailBodyText>
      <EmailBodyText>
        We&apos;ve included the key details below so you can keep everything in one place.
      </EmailBodyText>
      {bookingSummary(data)}
      {data.bookingUrl ? (
        <EmailButton
          accentColor={branding.accentColor}
          href={data.bookingUrl}
          label="View booking details"
        />
      ) : null}
    </EmailLayout>
  );

  const text = [
    `Hi ${data.customerName ?? "there"},`,
    "",
    `Your booking with ${branding.organizationName} is confirmed.`,
    data.serviceName ? `Service: ${data.serviceName}` : null,
    data.bookingDateLabel ? `Date: ${data.bookingDateLabel}` : null,
    data.bookingTimeLabel ? `Time: ${data.bookingTimeLabel}` : null,
    `Booking reference: ${data.bookingId}`,
    data.bookingUrl ? `Booking details: ${data.bookingUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return { body, html: "", subject, text };
}
