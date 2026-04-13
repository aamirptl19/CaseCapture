"use client";

import { useState } from "react";
import type { IntakeFormData, Urgency, BudgetPreference } from "@/types";
import type { ConditionalField } from "@/lib/intake-fields";
import { AREA_LABELS, URGENCY_LABELS, BUDGET_LABELS, cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Clock, FileText, AlertCircle, Paperclip } from "lucide-react";

interface Props {
  data: IntakeFormData;
  conditionalFields: ConditionalField[];
  onChange: (updates: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const URGENCY_OPTIONS: Array<{ value: Urgency; label: string; description: string }> = [
  { value: "immediate", label: "Immediately", description: "Within 48 hours — urgent or time-critical" },
  { value: "this_week", label: "This week", description: "I need help fairly soon" },
  { value: "this_month", label: "This month", description: "Not urgent but I want to move forward" },
  { value: "exploring", label: "Just exploring", description: "Getting information, no fixed timeline" },
];

const BUDGET_OPTIONS: Array<{ value: BudgetPreference; label: string }> = [
  { value: "legal_aid", label: "Legal Aid (if eligible)" },
  { value: "fixed_fee", label: "Fixed fee" },
  { value: "hourly", label: "Hourly rate" },
  { value: "unsure", label: "Not sure — happy to discuss" },
];

export function Step3Case({ data, conditionalFields, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!data.issue_description.trim() || data.issue_description.trim().length < 30) {
      errs.issue_description = "Please describe your situation in a bit more detail (at least 30 characters).";
    }
    if (!data.urgency) errs.urgency = "Please select a timeline.";

    // Validate required conditional fields
    conditionalFields
      .filter((f) => f.required)
      .forEach((f) => {
        if (!data.area_responses[f.key]) {
          errs[f.key] = "This field is required.";
        }
      });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  function updateAreaResponse(key: string, value: string | boolean) {
    onChange({ area_responses: { ...data.area_responses, [key]: value } });
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-slate-900 mb-1">
        Tell us about your{" "}
        <span className="italic">
          {data.area_of_law ? AREA_LABELS[data.area_of_law] : ""} matter
        </span>
      </h2>
      <p className="text-slate-500 text-sm mb-7">
        The more detail you provide, the better we can prepare for your enquiry.
      </p>

      <div className="space-y-6 mb-8">
        {/* Issue description */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Describe your situation
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Please describe your situation in your own words. Include what has happened, when it started, and what outcome you are hoping for…"
            value={data.issue_description}
            onChange={(e) => {
              onChange({ issue_description: e.target.value });
              if (errors.issue_description) setErrors((p) => ({ ...p, issue_description: "" }));
            }}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none",
              errors.issue_description
                ? "border-red-300 bg-red-50 focus:ring-red-200"
                : "border-slate-200 bg-white"
            )}
          />
          <div className="flex justify-between">
            {errors.issue_description ? (
              <p className="text-xs text-red-600 font-medium">{errors.issue_description}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-slate-400 text-right">
              {data.issue_description.length} characters
            </p>
          </div>
        </div>

        {/* Area-specific conditional fields */}
        {conditionalFields.length > 0 && (
          <div className="space-y-4 pt-1">
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                A few more questions about your {data.area_of_law ? AREA_LABELS[data.area_of_law] : ""} matter
              </p>
              <div className="space-y-4">
                {conditionalFields.map((field) => (
                  <ConditionalFieldInput
                    key={field.key}
                    field={field}
                    value={(data.area_responses[field.key] as string) ?? ""}
                    error={errors[field.key]}
                    onChange={(v) => updateAreaResponse(field.key, v)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Urgency */}
        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            How soon do you need help?
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {URGENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange({ urgency: opt.value });
                  if (errors.urgency) setErrors((p) => ({ ...p, urgency: "" }));
                }}
                className={cn(
                  "flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all",
                  data.urgency === opt.value
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className={cn("w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 transition-colors",
                  data.urgency === opt.value ? "border-primary bg-primary" : "border-slate-300"
                )}>
                  {data.urgency === opt.value && (
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                </div>
              </button>
            ))}
          </div>
          {errors.urgency && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.urgency}
            </p>
          )}
        </div>

        {/* Optional fields */}
        <div className="space-y-4 pt-1 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-3">
            Optional — but helpful
          </p>

          {/* Opposing party */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Who is the other party? (if applicable)
            </label>
            <input
              type="text"
              placeholder="e.g. Employer name, ex-partner, landlord, local council…"
              value={data.opposing_party}
              onChange={(e) => onChange({ opposing_party: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {/* Relevant dates */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Are there any important dates or deadlines?
            </label>
            <input
              type="text"
              placeholder="e.g. Court hearing on 15 Aug, notice expires 30 June, redundancy effective 1 Sept…"
              value={data.relevant_dates}
              onChange={(e) => onChange({ relevant_dates: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
            <p className="text-xs text-slate-400">Include any court dates, limitation deadlines, or expiry dates.</p>
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              How are you expecting to fund this matter?
            </label>
            <select
              value={data.budget_preference}
              onChange={(e) => onChange({ budget_preference: e.target.value as BudgetPreference })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            >
              <option value="">Select an option…</option>
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Documents */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <Paperclip className="w-3.5 h-3.5 text-slate-400" />
              Do you have relevant documents?
            </label>
            <div className="flex gap-3">
              {[{ value: true, label: "Yes, I have documents" }, { value: false, label: "No, not yet" }].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => onChange({ has_documents: opt.value })}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                    data.has_documents === opt.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">e.g. contracts, letters, court papers, tenancy agreements</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
        >
          Review & submit
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Conditional field renderer ───────────────────────────────

function ConditionalFieldInput({
  field,
  value,
  error,
  onChange,
}: {
  field: ConditionalField;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const baseInputClass = cn(
    "w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
    error ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"
  );

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === "select" && field.options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className={baseInputClass}>
          <option value="">Select an option…</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          rows={3}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(baseInputClass, "resize-none")}
        />
      ) : (
        <input
          type="text"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        />
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
