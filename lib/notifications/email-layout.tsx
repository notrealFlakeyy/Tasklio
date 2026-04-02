/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from "react";

import type { NotificationEmailBranding } from "@/lib/notifications/email-template-types";

type EmailLayoutProps = {
  branding: NotificationEmailBranding;
  children: ReactNode;
  preview: string;
  title: string;
};

export function EmailLayout({
  branding,
  children,
  preview,
  title,
}: EmailLayoutProps) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#f8faf8",
          color: "#443730",
          fontFamily: "Manrope, Arial, sans-serif",
          margin: 0,
          padding: "32px 16px",
        }}
      >
        <div style={{ display: "none", maxHeight: 0, opacity: 0, overflow: "hidden" }}>
          {preview}
        </div>
        <table
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ margin: "0 auto", maxWidth: 640, width: "100%" }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  background:
                    "linear-gradient(160deg, rgba(234,247,207,0.95), rgba(255,255,255,0.98), rgba(230,253,255,0.94))",
                  border: "1px solid rgba(120, 100, 82, 0.16)",
                  borderRadius: 28,
                  overflow: "hidden",
                  padding: 32,
                }}
              >
                <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
                  <img
                    alt="ClientFlow logo"
                    height="52"
                    src={branding.logoUrl}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.88)",
                      border: "1px solid rgba(120, 100, 82, 0.14)",
                      borderRadius: 18,
                      display: "block",
                      height: 52,
                      objectFit: "contain",
                      padding: 6,
                      width: 52,
                    }}
                    width="52"
                  />
                  <div>
                    <div
                      style={{
                        color: "#786452",
                        fontSize: 12,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                      }}
                    >
                      ClientFlow
                    </div>
                    <div
                      style={{
                        color: "#443730",
                        fontSize: 20,
                        fontWeight: 700,
                        marginTop: 4,
                      }}
                    >
                      {branding.organizationName}
                    </div>
                  </div>
                </div>

                <h1
                  style={{
                    color: "#443730",
                    fontFamily: "Fraunces, Georgia, serif",
                    fontSize: 34,
                    lineHeight: 1.05,
                    margin: "28px 0 0",
                  }}
                >
                  {title}
                </h1>

                <div style={{ marginTop: 24 }}>{children}</div>

                <div
                  style={{
                    borderTop: "1px solid rgba(120, 100, 82, 0.16)",
                    color: "#786452",
                    fontSize: 13,
                    lineHeight: 1.7,
                    marginTop: 28,
                    paddingTop: 18,
                  }}
                >
                  <p style={{ margin: 0 }}>
                    Sent by ClientFlow for {branding.organizationName}.
                  </p>
                  <p style={{ margin: "6px 0 0" }}>
                    {branding.supportEmail
                      ? `Questions? Reply to ${branding.supportEmail}.`
                      : "This message is part of your booking workflow."}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

export function EmailBodyText({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p
      style={{
        color: "#5f5148",
        fontSize: 16,
        lineHeight: 1.8,
        margin: "0 0 14px",
      }}
    >
      {children}
    </p>
  );
}

export function EmailDetailCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.86)",
        border: "1px solid rgba(120, 100, 82, 0.16)",
        borderRadius: 22,
        marginTop: 20,
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

export function EmailDetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          color: "#786452",
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#443730",
          fontSize: 16,
          fontWeight: 600,
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function EmailButton({
  href,
  label,
  accentColor,
}: {
  accentColor: string;
  href: string;
  label: string;
}) {
  return (
    <div style={{ marginTop: 24 }}>
      <a
        href={href}
        style={{
          backgroundColor: accentColor,
          borderRadius: 16,
          color: "#ffffff",
          display: "inline-block",
          fontSize: 15,
          fontWeight: 700,
          padding: "14px 20px",
          textDecoration: "none",
        }}
      >
        {label}
      </a>
    </div>
  );
}
