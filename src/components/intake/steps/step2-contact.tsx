"use client";

import { useState } from "react";
import type { IntakeFormData } from "@/types";
import { ChevronRight, ChevronLeft, User, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: IntakeFormData;
  onChange: (updates: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Contact({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!data.full_name.trim()) errs.full_name = "Please enter your full name.";
    if (!data.email.trim()) errs.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = "Please enter a valid email address.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-slate-900 mb-1">Your contact details</h2>
      <p className="text-slate-500 text-sm mb-7">
        How should the firm contact you? All information is kept strictly confidential.
      </p>

      <div className="space-y-5 mb-8">
        {/* Full name */}
        <FormField
          label="Full name"
          required
          error={errors.full_name}
          icon={User}
        >
          <input
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            value={data.full_name}
            onChange={(e) => {
              onChange({ full_name: e.target.value });
              if (errors.full_name) setErrors((p) => ({ ...p, full_name: "" }));
            }}
            className={inputClass(!!errors.full_name)}
          />
        </FormField>

        {/* Email */}
        <FormField
          label="Email address"
          required
          error={errors.email}
          icon={Mail}
          hint="We'll use this to confirm receipt of your enquiry."
        >
          <input
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            value={data.email}
            onChange={(e) => {
              onChange({ email: e.target.value });
              if (errors.email) setErrors((p) => ({ ...p, email: "" }));
            }}
            className={inputClass(!!errors.email)}
          />
        </FormField>

        {/* Phone */}
        <FormField
          label="Phone number"
          icon={Phone}
          hint="Optional but recommended — helps us reach you quickly."
        >
          <input
            type="tel"
            autoComplete="tel"
            placeholder="07700 900 000"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className={inputClass(false)}
          />
        </FormField>
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
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────

function FormField({
  label,
  required,
  error,
  icon: Icon,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ElementType;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
    hasError
      ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400"
      : "border-slate-200 bg-white"
  );
}
