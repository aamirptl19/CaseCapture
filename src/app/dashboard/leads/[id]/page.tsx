import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  formatDate,
  formatDateTime,
  AREA_LABELS,
  URGENCY_LABELS,
  BUDGET_LABELS,
  NEXT_STEP_LABELS,
  cn,
  getTriageColour,
  getAreaColour,
  getUrgencyColour,
  TRIAGE_LABELS,
} from "@/lib/utils";
import type { LeadWithDetails, BudgetPreference, NextStep, TriageLabel, AreaOfLaw, Urgency } from "@/types";
import { LeadStatusUpdater } from "@/components/dashboard/lead-status-updater";
import { LeadNotes } from "@/components/dashboard/lead-notes";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Flag,
  Paperclip,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch lead with all related data
  const { data: lead } = await supabase
    .from("leads")
    .select(`
      *,
      intake_responses (*),
      ai_summaries (*),
      lead_notes (*, users (full_name))
    `)
    .eq("id", params.id)
    .single();

  if (!lead) notFound();

  const typedLead = lead as LeadWithDetails;
  const ai = typedLead.ai_summaries;
  const intake = typedLead.intake_responses;
  const notes = typedLead.lead_notes ?? [];

  // Fetch current user profile for notes
  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Back nav */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to leads
      </Link>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-slate-900">{typedLead.full_name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", getAreaColour(typedLead.area_of_law as AreaOfLaw))}>
              {AREA_LABELS[typedLead.area_of_law as AreaOfLaw]}
            </span>
            <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", getUrgencyColour(typedLead.urgency as Urgency))}>
              {URGENCY_LABELS[typedLead.urgency as Urgency]}
            </span>
            <span className="text-xs text-slate-400">Received {formatDate(typedLead.created_at)}</span>
          </div>
        </div>
        <LeadStatusUpdater leadId={typedLead.id} currentStatus={typedLead.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left column: intake data ─────────────────────── */}
        <div className="lg:col-span-3 space-y-5">

          {/* Contact details */}
          <SectionCard title="Contact Details" icon={User}>
            <div className="space-y-3">
              <DetailRow icon={User} label="Full name" value={typedLead.full_name} />
              <DetailRow icon={Mail} label="Email" value={typedLead.email} isLink={`mailto:${typedLead.email}`} />
              {typedLead.phone && (
                <DetailRow icon={Phone} label="Phone" value={typedLead.phone} isLink={`tel:${typedLead.phone}`} />
              )}
              {typedLead.budget_preference && (
                <DetailRow
                  icon={FileText}
                  label="Budget / funding"
                  value={BUDGET_LABELS[typedLead.budget_preference as BudgetPreference] ?? typedLead.budget_preference}
                />
              )}
              <DetailRow
                icon={Paperclip}
                label="Documents available"
                value={typedLead.has_documents ? "Yes — client has documents" : "No"}
              />
            </div>
          </SectionCard>

          {/* Issue description */}
          <SectionCard title="Issue Description" icon={FileText}>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {typedLead.issue_description}
            </p>
          </SectionCard>

          {/* Case specifics */}
          <SectionCard title="Case Specifics" icon={Calendar}>
            <div className="space-y-3">
              {typedLead.opposing_party && (
                <DetailRow icon={User} label="Opposing party" value={typedLead.opposing_party} />
              )}
              {typedLead.relevant_dates && (
                <DetailRow icon={Calendar} label="Relevant dates" value={typedLead.relevant_dates} />
              )}
              {(!typedLead.opposing_party && !typedLead.relevant_dates) && (
                <p className="text-sm text-slate-400 italic">No additional specifics provided.</p>
              )}
            </div>
          </SectionCard>

          {/* Area-specific responses */}
          {intake?.responses && Object.keys(intake.responses).length > 0 && (
            <SectionCard title="Area-Specific Answers" icon={ChevronRight}>
              <dl className="space-y-3">
                {Object.entries(intake.responses).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="text-sm text-slate-800">{String(value).replace(/_/g, " ")}</dd>
                  </div>
                ))}
              </dl>
            </SectionCard>
          )}

          {/* Notes */}
          <LeadNotes
            leadId={typedLead.id}
            initialNotes={notes}
            currentUserId={profile?.id ?? ""}
            currentUserName={profile?.full_name ?? "You"}
          />
        </div>

        {/* ── Right column: AI summary ─────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {ai ? (
            <>
              {/* Triage label */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-semibold text-slate-700">AI Triage Assessment</h2>
                </div>
                <div className="p-5 space-y-4">
                  <AiDisclaimer />

                  {ai.triage_label && (
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Triage</p>
                      <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold", getTriageColour(ai.triage_label as TriageLabel))}>
                        {TRIAGE_LABELS[ai.triage_label as TriageLabel]}
                      </span>
                      {ai.triage_reason && (
                        <p className="text-sm text-slate-600 mt-2">{ai.triage_reason}</p>
                      )}
                    </div>
                  )}

                  {ai.next_step && (
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Suggested Next Step</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {NEXT_STEP_LABELS[ai.next_step as NextStep]}
                      </p>
                      {ai.next_step_rationale && (
                        <p className="text-sm text-slate-600 mt-1">{ai.next_step_rationale}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Case synopsis */}
              {ai.case_synopsis && (
                <SectionCard title="Case Synopsis" icon={Sparkles}>
                  <p className="text-sm text-slate-700 leading-relaxed">{ai.case_synopsis}</p>
                </SectionCard>
              )}

              {/* Key facts */}
              {ai.key_facts && ai.key_facts.length > 0 && (
                <SectionCard title="Key Facts Extracted" icon={ChevronRight}>
                  <ul className="space-y-2">
                    {ai.key_facts.map((fact, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              )}

              {/* Flags */}
              {ai.flags && ai.flags.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Flag className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-amber-800">Flags</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {ai.flags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-slate-400 text-right">
                Generated {formatDateTime(ai.generated_at)} · {ai.model_used}
              </p>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-slate-400 animate-pulse" />
              </div>
              <p className="text-sm font-medium text-slate-700">AI summary processing…</p>
              <p className="text-xs text-slate-400 mt-1">Refresh the page in a moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  isLink,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isLink?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        {isLink ? (
          <a href={isLink} className="text-sm text-primary hover:underline">
            {value}
          </a>
        ) : (
          <p className="text-sm text-slate-800">{value}</p>
        )}
      </div>
    </div>
  );
}

function AiDisclaimer() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
      <p className="text-xs text-slate-500 leading-relaxed">
        <span className="font-semibold text-slate-600">Administrative use only.</span>{" "}
        This assessment is generated by AI to assist internal triage. It does not constitute legal advice and should be reviewed by a qualified fee-earner before any action is taken.
      </p>
    </div>
  );
}
