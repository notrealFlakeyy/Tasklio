import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import "@/app/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Booking SaaS MVP Starter",
  description:
    "Production-ready booking MVP scaffold with Next.js, Supabase, and scalable multi-tenant foundations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable} app-shell antialiased`}>
        {children}
      </body>
    </html>
  );
}
