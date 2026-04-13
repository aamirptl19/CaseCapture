// =============================================================
// ClearIntake — Shared TypeScript Types
// =============================================================

export type AreaOfLaw =
  | "family"
  | "housing"
  | "immigration"
  | "employment"
  | "litigation"
  | "conveyancing";

export type Urgency =
  | "immediate"
  | "this_week"
  | "this_month"
  | "exploring";

export type BudgetPreference =
  | "legal_aid"
  | "fixed_fee"
  | "hourly"
  | "unsure";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "rejected"
  | "booked";

export type TriageLabel =
  | "high_priority"
  | "standard_review"
  | "low_priority"
  | "insufficient_info";

export type NextStep =
  | "paid_consultation"
  | "fixed_fee_likely"
  | "partner_review"
  | "not_suitable";

// ── Database row shapes ──────────────────────────────────────

export interface Firm {
  id: string;
  name: string;
  slug: string;
  contact_email: string | null;
  plan: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  firm_id: string;
  full_name: string;
  role: "admin" | "staff";
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  firm_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  area_of_law: AreaOfLaw;
  urgency: Urgency;
  issue_description: string;
  opposing_party: string | null;
  relevant_dates: string | null;
  budget_preference: BudgetPreference | null;
  has_documents: boolean;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface IntakeResponse {
  id: string;
  lead_id: string;
  responses: Record<string, string | boolean | string[]>;
  created_at: string;
}

export interface AiSummary {
  id: string;
  lead_id: string;
  case_synopsis: string | null;
  key_facts: string[];
  triage_label: TriageLabel | null;
  triage_reason: string | null;
  next_step: NextStep | null;
  next_step_rationale: string | null;
  flags: string[];
  model_used: string | null;
  generated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  user_id: string;
  note: string;
  created_at: string;
  users?: { full_name: string };
}

// Full lead with related data — used in detail view
export interface LeadWithDetails extends Lead {
  intake_responses?: IntakeResponse | null;
  ai_summaries?: AiSummary | null;
  lead_notes?: LeadNote[];
}

// ── Intake form state ────────────────────────────────────────

export interface IntakeFormData {
  // Step 1
  area_of_law: AreaOfLaw | "";
  // Step 2
  full_name: string;
  email: string;
  phone: string;
  // Step 3
  issue_description: string;
  urgency: Urgency | "";
  opposing_party: string;
  relevant_dates: string;
  budget_preference: BudgetPreference | "";
  has_documents: boolean;
  area_responses: Record<string, string | boolean>;
}

export const EMPTY_FORM: IntakeFormData = {
  area_of_law: "",
  full_name: "",
  email: "",
  phone: "",
  issue_description: "",
  urgency: "",
  opposing_party: "",
  relevant_dates: "",
  budget_preference: "",
  has_documents: false,
  area_responses: {},
};
