import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Hub Academy",
  description:
    "Guided, outcome-based learning for AudioCodes Live Hub — from first click to first production call.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
