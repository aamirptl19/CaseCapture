// =============================================================
// ClearIntake — Area-Specific Conditional Fields
// These extra questions appear in Step 3 based on area_of_law.
// =============================================================

export interface ConditionalField {
  key: string;
  label: string;
  type: "select" | "text" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export const AREA_CONDITIONAL_FIELDS: Record<string, ConditionalField[]> = {
  family: [
    {
      key: "family_matter_type",
      label: "What is the nature of your family matter?",
      type: "select",
      required: true,
      options: [
        { value: "divorce_separation", label: "Divorce or separation" },
        { value: "children_arrangements", label: "Children arrangements" },
        { value: "financial_remedy", label: "Financial remedy / asset division" },
        { value: "domestic_abuse", label: "Domestic abuse / injunction" },
        { value: "cohabitation", label: "Cohabitation dispute" },
        { value: "other", label: "Other family matter" },
      ],
    },
    {
      key: "married",
      label: "Were you married or in a civil partnership with the other party?",
      type: "select",
      options: [
        { value: "yes_married", label: "Yes — married" },
        { value: "yes_civil_partnership", label: "Yes — civil partnership" },
        { value: "no", label: "No" },
      ],
    },
    {
      key: "children_involved",
      label: "Are there children involved?",
      type: "select",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      key: "existing_proceedings",
      label: "Are there existing court proceedings?",
      type: "select",
      options: [
        { value: "yes", label: "Yes — proceedings already started" },
        { value: "no", label: "No" },
        { value: "unsure", label: "Not sure" },
      ],
    },
  ],

  housing: [
    {
      key: "housing_issue_type",
      label: "What type of housing issue do you have?",
      type: "select",
      required: true,
      options: [
        { value: "eviction", label: "Eviction / possession proceedings" },
        { value: "disrepair", label: "Disrepair / housing conditions" },
        { value: "deposit_dispute", label: "Deposit dispute" },
        { value: "illegal_eviction", label: "Illegal eviction or harassment" },
        { value: "neighbour_dispute", label: "Neighbour dispute" },
        { value: "homelessness", label: "Homelessness / council housing" },
        { value: "other", label: "Other housing matter" },
      ],
    },
    {
      key: "tenure_type",
      label: "What is your tenure?",
      type: "select",
      options: [
        { value: "private_tenant", label: "Private tenant" },
        { value: "social_tenant", label: "Social / council tenant" },
        { value: "owner_occupier", label: "Owner occupier" },
        { value: "other", label: "Other" },
      ],
    },
    {
      key: "formal_notice_received",
      label: "Have you received a formal notice or court papers?",
      type: "select",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unsure", label: "Not sure" },
      ],
    },
  ],

  immigration: [
    {
      key: "immigration_matter_type",
      label: "What is the nature of your immigration matter?",
      type: "select",
      required: true,
      options: [
        { value: "visa_application", label: "Visa application" },
        { value: "visa_refusal_appeal", label: "Visa refusal or appeal" },
        { value: "settlement_ilr", label: "Settlement / ILR" },
        { value: "british_citizenship", label: "British citizenship / naturalisation" },
        { value: "deportation_removal", label: "Deportation or removal proceedings" },
        { value: "asylum", label: "Asylum claim" },
        { value: "family_reunion", label: "Family reunion / spouse visa" },
        { value: "work_visa", label: "Work visa / skilled worker" },
        { value: "other", label: "Other immigration matter" },
      ],
    },
    {
      key: "current_uk_status",
      label: "What is your current immigration status in the UK?",
      type: "select",
      options: [
        { value: "settled_ilr", label: "Settled status or ILR" },
        { value: "limited_leave", label: "Limited leave to remain (visa)" },
        { value: "leave_expired", label: "Leave expired or overstayed" },
        { value: "british_citizen", label: "British citizen" },
        { value: "outside_uk", label: "Currently outside the UK" },
        { value: "unsure", label: "Not sure" },
      ],
    },
    {
      key: "deadline_or_hearing",
      label: "Is there a deadline, hearing date, or removal date?",
      type: "select",
      options: [
        { value: "yes", label: "Yes — there is a deadline or hearing" },
        { value: "no", label: "No" },
        { value: "unsure", label: "Not sure" },
      ],
    },
  ],

  employment: [
    {
      key: "employment_issue_type",
      label: "What is the nature of your employment matter?",
      type: "select",
      required: true,
      options: [
        { value: "unfair_dismissal", label: "Unfair dismissal" },
        { value: "redundancy", label: "Redundancy" },
        { value: "discrimination", label: "Discrimination" },
        { value: "harassment_bullying", label: "Harassment or bullying" },
        { value: "settlement_agreement", label: "Settlement agreement" },
        { value: "unpaid_wages", label: "Unpaid wages or holiday pay" },
        { value: "whistleblowing", label: "Whistleblowing / protected disclosure" },
        { value: "contract_dispute", label: "Contract dispute" },
        { value: "other", label: "Other employment matter" },
      ],
    },
    {
      key: "employment_status",
      label: "What is your employment status?",
      type: "select",
      options: [
        { value: "employee", label: "Employee" },
        { value: "worker", label: "Worker / zero-hours" },
        { value: "self_employed", label: "Self-employed / contractor" },
        { value: "director", label: "Company director" },
      ],
    },
    {
      key: "still_employed",
      label: "Are you still employed by this employer?",
      type: "select",
      options: [
        { value: "yes", label: "Yes — still employed" },
        { value: "no", label: "No — employment has ended" },
        { value: "garden_leave", label: "On garden leave or notice period" },
      ],
    },
    {
      key: "et_claim_status",
      label: "Have you filed an Employment Tribunal claim or started ACAS conciliation?",
      type: "select",
      options: [
        { value: "et1_filed", label: "ET1 claim already filed" },
        { value: "acas_started", label: "ACAS early conciliation started" },
        { value: "neither", label: "Neither — not yet" },
      ],
    },
  ],

  litigation: [
    {
      key: "dispute_type",
      label: "What type of dispute is this?",
      type: "select",
      required: true,
      options: [
        { value: "debt_recovery", label: "Debt recovery" },
        { value: "contract_dispute", label: "Contract dispute" },
        { value: "professional_negligence", label: "Professional negligence" },
        { value: "personal_injury", label: "Personal injury" },
        { value: "property_boundary", label: "Property or boundary dispute" },
        { value: "shareholder_dispute", label: "Company or shareholder dispute" },
        { value: "defamation", label: "Defamation" },
        { value: "other", label: "Other civil dispute" },
      ],
    },
    {
      key: "claim_value",
      label: "Approximate value of your claim (if known)",
      type: "select",
      options: [
        { value: "under_10k", label: "Under £10,000" },
        { value: "10k_25k", label: "£10,000 – £25,000" },
        { value: "25k_100k", label: "£25,000 – £100,000" },
        { value: "over_100k", label: "Over £100,000" },
        { value: "unknown", label: "Not known" },
      ],
    },
    {
      key: "proceedings_status",
      label: "Have court proceedings been issued?",
      type: "select",
      options: [
        { value: "yes_issued", label: "Yes — claim already issued" },
        { value: "letter_of_claim", label: "Letter of claim sent or received" },
        { value: "no", label: "No — not yet" },
      ],
    },
  ],

  conveyancing: [
    {
      key: "transaction_type",
      label: "What type of property transaction is this?",
      type: "select",
      required: true,
      options: [
        { value: "purchase", label: "Purchase" },
        { value: "sale", label: "Sale" },
        { value: "sale_and_purchase", label: "Sale and purchase (chain)" },
        { value: "remortgage", label: "Remortgage" },
        { value: "transfer_of_equity", label: "Transfer of equity" },
        { value: "lease_extension", label: "Lease extension" },
        { value: "property_dispute", label: "Property or boundary dispute" },
        { value: "other", label: "Other property matter" },
      ],
    },
    {
      key: "property_value",
      label: "Approximate property value",
      type: "select",
      options: [
        { value: "under_250k", label: "Under £250,000" },
        { value: "250k_500k", label: "£250,000 – £500,000" },
        { value: "500k_1m", label: "£500,000 – £1,000,000" },
        { value: "over_1m", label: "Over £1,000,000" },
        { value: "unknown", label: "Not sure" },
      ],
    },
    {
      key: "tenure",
      label: "Is the property freehold or leasehold?",
      type: "select",
      options: [
        { value: "freehold", label: "Freehold" },
        { value: "leasehold", label: "Leasehold" },
        { value: "unknown", label: "Not sure" },
      ],
    },
    {
      key: "chain",
      label: "Is there a chain involved?",
      type: "select",
      options: [
        { value: "yes", label: "Yes — part of a chain" },
        { value: "no", label: "No — no chain" },
        { value: "unknown", label: "Not sure" },
      ],
    },
  ],
};
