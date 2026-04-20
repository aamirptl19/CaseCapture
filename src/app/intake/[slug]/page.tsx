import { createServiceClient } from "@/lib/supabase/service";
import { notFound } from "next/navigation";
import { IntakeWizard } from "@/components/intake/intake-wizard";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = createServiceClient();
  const { data: firm } = await service
    .from("firms")
    .select("name")
    .eq("slug", params.slug)
    .single();

  return {
    title: firm ? `New Enquiry — ${firm.name}` : "Legal Enquiry",
    description: "Submit your legal enquiry securely and confidentially.",
  };
}

export default async function IntakePage({ params }: Props) {
  const service = createServiceClient();
  const { data: firm } = await service
    .from("firms")
    .select("id, name, slug, active")
    .eq("slug", params.slug)
    .single();

  if (!firm || !firm.active) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-slate-900 text-sm">{firm.name}</span>
            <span className="text-slate-300">·</span>
            <span className="text-sm text-slate-500">New Enquiry</span>
          </div>
        </div>
      </header>

      {/* Wizard */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl text-slate-900 mb-3">
            Tell us about your matter
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            Please complete this form as fully as you can. Your answers help us understand your situation and prepare for your enquiry. All information is treated in strict confidence.
          </p>
        </div>
        <IntakeWizard firmSlug={firm.slug} firmName={firm.name} />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16 py-6 text-center">
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          By submitting this form, you agree that your information will be securely shared with {firm.name} for the purpose of assessing your enquiry. Lexaro acts as a technology provider processing this information on the firm’s behalf.
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Powered by <span className="font-medium">Lexaro</span> ·{" "}
          <a href="/privacy" className="hover:text-slate-600 underline underline-offset-2 transition-colors">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}
