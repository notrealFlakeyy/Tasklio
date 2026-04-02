import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import "@/app/globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "ClientFlow",
  description:
    "ClientFlow is a premium booking and client operations app for service businesses, built with Next.js and Supabase.",
  icons: {
    icon: "/branding/clientflow_logo_black.png",
    shortcut: "/branding/clientflow_logo_black.png",
    apple: "/branding/clientflow_logo_black.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable} app-shell antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
