import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  AreaOfLaw,
  Urgency,
  LeadStatus,
  TriageLabel,
  NextStep,
  BudgetPreference,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Display labels ────────────────────────────────────────────

export const AREA_LABELS: Record<AreaOfLaw, string> = {
  family: "Family Law",
  housing: "Housing",
  immigration: "Immigration",
  employment: "Employment",
  litigation: "Litigation / Disputes",
  conveyancing: "Conveyancing / Property",
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  immediate: "Immediately (within 48h)",
  this_week: "This week",
  this_month: "This month",
  exploring: "Just exploring",
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  rejected: "Rejected",
  booked: "Booked",
};

export const TRIAGE_LABELS: Record<TriageLabel, string> = {
  high_priority: "High Priority",
  standard_review: "Standard Review",
  low_priority: "Low Priority",
  insufficient_info: "Insufficient Info",
};

export const NEXT_STEP_LABELS: Record<NextStep, string> = {
  paid_consultation: "Paid Consultation",
  fixed_fee_likely: "Fixed Fee Likely",
  partner_review: "Partner Review",
  not_suitable: "Not Suitable",
};

export const BUDGET_LABELS: Record<BudgetPreference, string> = {
  legal_aid: "Legal Aid",
  fixed_fee: "Fixed Fee",
  hourly: "Hourly Rate",
  unsure: "Not Sure",
};

// ── Badge colour maps ────────────────────────────────────────

export function getStatusColour(status: LeadStatus): string {
  const map: Record<LeadStatus, string> = {
    new: "bg-sky-50 text-sky-700 border-sky-200",
    contacted: "bg-amber-50 text-amber-700 border-amber-200",
    qualified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    booked: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return map[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
}

export function getTriageColour(label: TriageLabel): string {
  const map: Record<TriageLabel, string> = {
    high_priority: "bg-red-50 text-red-700 border-red-200",
    standard_review: "bg-sky-50 text-sky-700 border-sky-200",
    low_priority: "bg-slate-50 text-slate-600 border-slate-200",
    insufficient_info: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return map[label] ?? "bg-slate-100 text-slate-600 border-slate-200";
}

export function getUrgencyColour(urgency: Urgency): string {
  const map: Record<Urgency, string> = {
    immediate: "bg-red-50 text-red-700",
    this_week: "bg-amber-50 text-amber-700",
    this_month: "bg-sky-50 text-sky-700",
    exploring: "bg-slate-50 text-slate-600",
  };
  return map[urgency] ?? "bg-slate-50 text-slate-600";
}

export function getAreaColour(area: AreaOfLaw): string {
  const map: Record<AreaOfLaw, string> = {
    family: "bg-pink-50 text-pink-700",
    housing: "bg-teal-50 text-teal-700",
    immigration: "bg-violet-50 text-violet-700",
    employment: "bg-orange-50 text-orange-700",
    litigation: "bg-rose-50 text-rose-700",
    conveyancing: "bg-sky-50 text-sky-700",
  };
  return map[area] ?? "bg-slate-50 text-slate-600";
}

// ── Date formatting ──────────────────────────────────────────

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
