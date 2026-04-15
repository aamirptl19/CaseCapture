import OpenAI from "openai";
import type { TriageLabel, NextStep } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = "gpt-4o";

// ── Types ────────────────────────────────────────────────────

interface LeadDataForAI {
  area_of_law: string;
  urgency: string;
  issue_description: string;
  opposing_party?: string | null;
  relevant_dates?: string | null;
  budget_preference?: string | null;
  has_documents: boolean;
  area_responses?: Record<string, string | boolean>;
}

export interface AISummaryResult {
  case_synopsis: string;
  key_facts: string[];
  triage_label: TriageLabel;
  triage_reason: string;
  next_step: NextStep;
  next_step_rationale: string;
  flags: string[];
  model_used: string;
}

// ── Prompt ───────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an administrative triage assistant for a UK law firm.
Your job is to read a new client enquiry and produce a structured internal assessment
to help fee-earners quickly decide how to handle the lead.

RULES — follow these strictly:
- You are NOT providing legal advice. This is an internal administrative tool only.
- Use cautious, qualified language: "appears to concern", "may involve", "suggests".
- Do not state legal conclusions. Do not advise the client.
- Write in plain British English. Be concise — lawyers are busy.
- Do not repeat the question back. Extract and summarise only.

URGENCY AND TRIAGE:
- Distinguish between the client's stated urgency and the objective urgency of the matter.
- Do NOT rely solely on the client's selected urgency.
- Treat client-selected urgency as one signal only, and reduce its importance if it is not supported by the facts.
- Assess urgency and triage objectively based on:
  - actual deadlines or upcoming dates
  - legal or commercial seriousness
  - financial value or financial risk
  - whether the issue is ongoing, escalating, or causing immediate harm
  - whether delay is likely to materially worsen the client's position
- If a client marks something as urgent but no objective urgency exists, do NOT assign high_priority unless the facts justify it.

- Flag anything genuinely time-sensitive, urgent, or high-risk (court dates, limitation periods,
  domestic abuse indicators, deportation risk, imminent homelessness).

OUTPUT — return valid JSON only. No markdown. No code fences. No preamble.
{
  "case_synopsis": "2–3 sentence plain-English summary of what the client appears to need",
  "key_facts": [
    "Up to 6 key facts extracted from the enquiry — each as a short, standalone sentence"
  ],
  "triage_label": "high_priority | standard_review | low_priority | insufficient_info",
  "triage_reason": "One sentence explaining why this triage label was assigned, making clear whether urgency is supported by objective facts",
  "next_step": "paid_consultation | fixed_fee_likely | partner_review | not_suitable",
  "next_step_rationale": "One sentence explaining the suggested next step",
  "flags": ["Short flag strings for urgent items — empty array if none"]
}

TRIAGE LABEL DEFINITIONS:
- high_priority   → Time-sensitive deadlines, court dates, imminent homelessness,
                    deportation risk, domestic abuse, urgent employment loss,
                    or other objectively serious matters needing rapid review.
- standard_review → Clear legal issue, sufficient detail, no immediate urgency.
- low_priority    → Vague, speculative, low-seriousness, or early-stage "just exploring" enquiry.
- insufficient_info → Not enough detail to assess — needs follow-up before booking.

NEXT STEP DEFINITIONS:
- paid_consultation  → Complex or unclear — a lawyer needs to scope it first.
- fixed_fee_likely   → Common transactional matter (conveyancing, standard redundancy,
                       straightforward housing disrepair, etc.).
- partner_review     → High-value, sensitive, or unusual matter needing senior input.
- not_suitable       → Outside the firm's areas, no apparent legal merit, or abusive.`;

// ── Urgency label for prompt ─────────────────────────────────

const URGENCY_MAP: Record<string, string> = {
  immediate: "Immediately — within 48 hours",
  this_week: "This week",
  this_month: "This month",
  exploring: "No urgency — just exploring options",
};

// ── Main function ────────────────────────────────────────────

export async function generateAISummary(
  leadData: LeadDataForAI
): Promise<AISummaryResult> {
  const areaResponses =
    leadData.area_responses &&
    Object.keys(leadData.area_responses).length > 0
      ? Object.entries(leadData.area_responses)
          .map(([k, v]) => `  • ${k.replace(/_/g, " ")}: ${v}`)
          .join("\n")
      : "  None provided";

  const userMessage = `
ENQUIRY DETAILS

Area of law: ${leadData.area_of_law.replace(/_/g, " ")}
Client-selected urgency: ${URGENCY_MAP[leadData.urgency] ?? leadData.urgency}
Has documents available: ${leadData.has_documents ? "Yes" : "No"}
Budget / funding preference: ${leadData.budget_preference?.replace(/_/g, " ") || "Not stated"}
Opposing party: ${leadData.opposing_party || "Not provided"}
Relevant dates / deadlines mentioned: ${leadData.relevant_dates || "None provided"}

Issue description (client's own words):
${leadData.issue_description}

Area-specific answers:
${areaResponses}
`.trim();

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.2,
    max_tokens: 700,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content returned from OpenAI");

  const parsed = JSON.parse(content) as AISummaryResult;

  // Guard: ensure enum values are valid — fall back to safe defaults
  const validTriageLabels: TriageLabel[] = [
    "high_priority",
    "standard_review",
    "low_priority",
    "insufficient_info",
  ];
  const validNextSteps: NextStep[] = [
    "paid_consultation",
    "fixed_fee_likely",
    "partner_review",
    "not_suitable",
  ];

  if (!validTriageLabels.includes(parsed.triage_label)) {
    parsed.triage_label = "insufficient_info";
  }
  if (!validNextSteps.includes(parsed.next_step)) {
    parsed.next_step = "paid_consultation";
  }
  if (!Array.isArray(parsed.key_facts)) parsed.key_facts = [];
  if (!Array.isArray(parsed.flags)) parsed.flags = [];

  return { ...parsed, model_used: MODEL };
}