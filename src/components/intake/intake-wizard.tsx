"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitIntakeLead } from "@/app/actions/leads";
import { EMPTY_FORM, type IntakeFormData, type AreaOfLaw } from "@/types";
import { AREA_CONDITIONAL_FIELDS } from "@/lib/intake-fields";
import { AREA_LABELS } from "@/lib/utils";
import { Step1Area } from "./steps/step1-area";
import { Step2Contact } from "./steps/step2-contact";
import { Step3Case } from "./steps/step3-case";
import { Step4Review } from "./steps/step4-review";
import { CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Area of Law" },
  { id: 2, label: "Your Details" },
  { id: 3, label: "Your Matter" },
  { id: 4, label: "Review & Submit" },
];

export function IntakeWizard({ firmSlug, firmName }: { firmSlug: string; firmName: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<IntakeFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateForm(updates: Partial<IntakeFormData>) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function nextStep() {
    setStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const result = await submitIntakeLead(firmSlug, form);
    setSubmitting(false);
    if (result.success) {
      router.push(`/intake/${firmSlug}/thank-you`);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  const conditionalFields = form.area_of_law
    ? AREA_CONDITIONAL_FIELDS[form.area_of_law] ?? []
    : [];

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {STEPS.map((s, idx) => {
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      done
                        ? "bg-primary text-white"
                        : active
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-white border-2 border-slate-200 text-slate-400"
                    )}
                  >
                    {done ? <CheckCircle className="w-4 h-4" /> : s.id}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1.5 font-medium hidden sm:block",
                      active ? "text-slate-900" : "text-slate-400"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 mb-5 rounded-full transition-colors",
                      step > s.id ? "bg-primary" : "bg-slate-200"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Step content */}
          <div className="animate-fade-up" key={step}>
            {step === 1 && (
              <Step1Area
                selected={form.area_of_law as AreaOfLaw | ""}
                onSelect={(area) => {
                  // Clear area_responses when area changes
                  updateForm({ area_of_law: area, area_responses: {} });
                }}
                onNext={nextStep}
              />
            )}
            {step === 2 && (
              <Step2Contact
                data={form}
                onChange={updateForm}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {step === 3 && (
              <Step3Case
                data={form}
                conditionalFields={conditionalFields}
                onChange={updateForm}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {step === 4 && (
              <Step4Review
                data={form}
                conditionalFields={conditionalFields}
                onSubmit={handleSubmit}
                onBack={prevStep}
                submitting={submitting}
                error={error}
              />
            )}
          </div>
        </div>
      </div>

      {/* Step counter */}
      <p className="text-center text-xs text-slate-400 mt-4">
        Step {step} of {STEPS.length}
      </p>
    </div>
  );
}
