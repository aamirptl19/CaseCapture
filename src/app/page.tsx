import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lexaro — Legal Operations Infrastructure",
  description:
    "Lexaro helps law firms improve how they capture, manage and resource legal work.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-display text-lg text-slate-900 tracking-tight">Lexaro</span>
          <Link
            href="/login"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
          Lexaro
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-slate-900 leading-tight mb-5">
          Legal operations infrastructure<br className="hidden sm:block" /> for modern law firms
        </h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
          Lexaro helps law firms improve how they capture, manage and resource legal work.
        </p>
      </section>

      {/* ── Product cards ────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24 w-full">
        <div className="grid sm:grid-cols-2 gap-5">

          {/* Lexaro Intake */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Lexaro Intake
              </p>
              <h2 className="font-display text-2xl text-slate-900 mb-3">
                Smarter enquiry intake
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                AI-assisted enquiry triage and intake workflows for law firms.
              </p>
            </div>
            <div className="mt-auto flex flex-col gap-2.5">
              <Link
                href="/intake/demo"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[hsl(221,65%,17%)] text-white text-sm font-medium hover:bg-[hsl(221,65%,13%)] transition-colors"
              >
                View intake demo
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Access Intake
              </Link>
            </div>
          </div>

          {/* Lexaro Flex */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Lexaro Flex
              </p>
              <h2 className="font-display text-2xl text-slate-900 mb-3">
                Flexible legal talent
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Flexible legal talent marketplace for firms needing locum and interim legal support.
              </p>
            </div>
            <div className="mt-auto flex flex-col gap-2.5">
              <span
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-slate-200 text-slate-400 text-sm font-medium cursor-not-allowed select-none"
                aria-disabled="true"
              >
                Coming soon
              </span>
              <a
                href="https://flex.lexaro.co.uk/apply"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-white transition-colors bg-white"
              >
                Candidate application
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-slate-100 py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className="text-xs text-slate-400">© {new Date().getFullYear()} Lexaro</span>
          <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>

    </div>
  );
}
