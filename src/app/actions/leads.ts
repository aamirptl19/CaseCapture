"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { generateAISummary } from "@/lib/ai";
import { revalidatePath } from "next/cache";
import type { LeadStatus, IntakeFormData } from "@/types";

// ── Submit intake form (public, uses service role) ───────────

export async function submitIntakeLead(
  firmSlug: string,
  formData: IntakeFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const service = createServiceClient();

    // Resolve firm by slug
    const { data: firm, error: firmError } = await service
      .from("firms")
      .select("id, active")
      .eq("slug", firmSlug)
      .single();

    if (firmError || !firm) {
      return { success: false, error: "Firm not found." };
    }
    if (!firm.active) {
      return { success: false, error: "This intake form is not currently active." };
    }

    // Insert lead
    const { data: lead, error: leadError } = await service
      .from("leads")
      .insert({
        firm_id: firm.id,
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || null,
        area_of_law: formData.area_of_law,
        urgency: formData.urgency,
        issue_description: formData.issue_description.trim(),
        opposing_party: formData.opposing_party?.trim() || null,
        relevant_dates: formData.relevant_dates?.trim() || null,
        budget_preference: formData.budget_preference || null,
        has_documents: formData.has_documents,
        status: "new",
      })
      .select()
      .single();

    if (leadError || !lead) {
      console.error("Lead insert error:", leadError);
      return { success: false, error: "Failed to save your enquiry. Please try again." };
    }

    // Insert area-specific responses
    if (formData.area_responses && Object.keys(formData.area_responses).length > 0) {
      await service.from("intake_responses").insert({
        lead_id: lead.id,
        responses: formData.area_responses,
      });
    }

    // Generate AI summary (non-blocking — fire and await, but catch errors gracefully)
    try {
      const aiResult = await generateAISummary({
        area_of_law: formData.area_of_law,
        urgency: formData.urgency,
        issue_description: formData.issue_description,
        opposing_party: formData.opposing_party,
        relevant_dates: formData.relevant_dates,
        budget_preference: formData.budget_preference,
        has_documents: formData.has_documents,
        area_responses: formData.area_responses,
      });

      await service.from("ai_summaries").insert({
        lead_id: lead.id,
        case_synopsis: aiResult.case_synopsis,
        key_facts: aiResult.key_facts,
        triage_label: aiResult.triage_label,
        triage_reason: aiResult.triage_reason,
        next_step: aiResult.next_step,
        next_step_rationale: aiResult.next_step_rationale,
        flags: aiResult.flags,
        model_used: aiResult.model_used,
      });
    } catch (aiError) {
      // AI failure should not block the submission
      console.error("AI summary failed:", aiError);
    }

    return { success: true };
  } catch (err) {
    console.error("submitIntakeLead error:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// ── Update lead status (authenticated) ──────────────────────

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", leadId);

    if (error) return { error: "Failed to update status." };

    revalidatePath(`/dashboard/leads/${leadId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "An unexpected error occurred." };
  }
}

// ── Add internal note (authenticated) ───────────────────────

export async function addLeadNote(
  leadId: string,
  note: string
): Promise<{ note?: { id: string; lead_id: string; user_id: string; note: string; created_at: string }; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated." };

    const { data, error } = await supabase
      .from("lead_notes")
      .insert({
        lead_id: leadId,
        user_id: user.id,
        note: note.trim(),
      })
      .select()
      .single();

    if (error || !data) return { error: "Failed to save note." };

    revalidatePath(`/dashboard/leads/${leadId}`);
    return { note: data };
  } catch {
    return { error: "An unexpected error occurred." };
  }
}
