import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CaseCapture — Legal Intake & Triage",
    template: "%s | CaseCapture",
  },
  description:
    "AI-powered legal intake and triage for UK law firms. Capture better enquiries, triage faster.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
