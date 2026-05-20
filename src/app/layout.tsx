import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lexaro — Legal Intake & Triage",
    template: "%s | Lexaro",
  },
  description:
    "Lexaro helps law firms improve how they capture, manage and resource legal work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
