"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/app/actions/leads";
import { STATUS_LABELS, getStatusColour, cn } from "@/lib/utils";
import type { LeadStatus } from "@/types";
import { useToast } from "@/components/ui/toast";
import { ChevronDown } from "lucide-react";

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "qualified", "rejected", "booked"];

export function LeadStatusUpdater({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState<LeadStatus>(currentStatus as LeadStatus);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleChange(newStatus: LeadStatus) {
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, newStatus);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "error" });
        setStatus(currentStatus as LeadStatus); // revert
      } else {
        toast({ title: "Status updated", description: `Lead marked as ${STATUS_LABELS[newStatus]}.`, variant: "success" });
      }
    });
  }

  return (
    <div className="flex flex-col items-start sm:items-end gap-1.5">
      <p className="text-xs text-slate-500 font-medium">Lead Status</p>
      <div className="relative">
        <select
          value={status}
          onChange={(e) => handleChange(e.target.value as LeadStatus)}
          disabled={pending}
          className={cn(
            "appearance-none pl-3.5 pr-8 py-2 rounded-lg border text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
            getStatusColour(status)
          )}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-white text-slate-900 font-normal">
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-60" />
      </div>
    </div>
  );
}
