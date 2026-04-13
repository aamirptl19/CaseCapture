"use client";

import type { IntakeFormData } from "@/types";
import type { ConditionalField } from "@/lib/intake-fields";
import {
  AREA_LABELS,
  URGENCY_LABELS,
  BUDGET_LABELS,
  cn,
} from "@/lib/utils";
import {
  ChevronLeft,
  Send,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Scale,
  Clock,
  Banknote,
  Paperclip,
  FileText,
  Users,
  Calendar,
  CheckCircle,
} from "lucide-react";
import type { BudgetPreference } from "@/types";

interface Props {
  data: IntakeFormData;
  conditionalFields: ConditionalField[];
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
}

export function Step4Review({
  data,
  conditionalFields,
  onSubmit,
  onBack,
  submitting,
  error,
}: Props) {
  return (
    <div>
      <h2 className="font-display text-2xl text-slate-900 mb-1">
        Review your enquiry
      </h2>
      <p className="text-slate-500 text-sm mb-7">
        Please check the details below before submitting. You can go back and
        make changes.
      </p>

      <div className="space-y-4 mb-8">
        {/* Area of law */}
        <ReviewSection title="Area of Law" icon={Scale}>
          <ReviewRow
            label="Area"
            value={
              data.area_of_law ? AREA_LABELS[data.area_of_law] : "—"
            }
          />
        </ReviewSection>

        {/* Contact details */}
        <ReviewSection title="Contact Details" icon={User}>
          <ReviewRow label="Full name" value={data.full_name} icon={User} />
          <ReviewRow label="Email" value={data.email} icon={Mail} />
          {data.phone && (
            <ReviewRow label="Phone" value={data.phone} icon={Phone} />
          )}
        </ReviewSection>

        {/* Issue description */}
        <ReviewSection title="Issue Description" icon={FileText}>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {data.issue_description}
          </p>
        </ReviewSection>

        {/* Area-specific answers */}
        {conditionalFields.length > 0 &&
          Object.keys(data.area_responses).length > 0 && (
            <ReviewSection title="Matter Details" icon={CheckCircle}>
              {conditionalFields
                .filter((f) => data.area_responses[f.key])
                .map((field) => {
                  const rawValue = data.area_responses[field.key] as string;
                  const displayValue =
                    field.options?.find((o) => o.value === rawValue)?.label ??
                    rawValue;
                  return (
                    <ReviewRow
                      key={field.key}
                      label={field.label}
                      value={displayValue}
                    />
                  );
                })}
            </ReviewSection>
          )}

        {/* Timing & budget */}
        <ReviewSection title="Timeline & Funding" icon={Clock}>
          <ReviewRow
            label="Urgency"
            value={
              data.urgency ? URGENCY_LABELS[data.urgency] : "—"
            }
            icon={Clock}
          />
          {data.relevant_dates && (
            <ReviewRow
              label="Important dates"
              value={data.relevant_dates}
              icon={Calendar}
            />
          )}
          {data.opposing_party && (
            <ReviewRow
              label="Other party"
              value={data.opposing_party}
              icon={Users}
            />
          )}
          {data.budget_preference && (
            <ReviewRow
              label="Funding preference"
              value={
                BUDGET_LABELS[data.budget_preference as BudgetPreference] ??
                data.budget_preference
              }
              icon={Banknote}
            />
          )}
          <ReviewRow
            label="Documents available"
            value={data.has_documents ? "Yes" : "No"}
            icon={Paperclip}
          />
        </ReviewSection>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold">Please note:</span> Submitting this
          form does not create a solicitor-client relationship. A member of the
          firm will review your enquiry and be in touch. The information you
          provide is treated in strict confidence under our privacy policy.
          This form is not monitored 24/7 — if your matter is a genuine
          emergency, please call the firm directly or contact the relevant
          emergency services.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit enquiry
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function ReviewSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />}
      <div className={cn("flex-1 min-w-0", !Icon && "pl-0")}>
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm text-slate-800 font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}
