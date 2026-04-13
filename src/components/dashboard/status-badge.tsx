import { cn, getStatusColour, getTriageColour, getUrgencyColour, getAreaColour, STATUS_LABELS, TRIAGE_LABELS, URGENCY_LABELS, AREA_LABELS } from "@/lib/utils";
import type { LeadStatus, TriageLabel, Urgency, AreaOfLaw } from "@/types";

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", getStatusColour(status))}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function TriageBadge({ label }: { label: TriageLabel }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", getTriageColour(label))}>
      {TRIAGE_LABELS[label]}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getUrgencyColour(urgency))}>
      {URGENCY_LABELS[urgency]}
    </span>
  );
}

export function AreaBadge({ area }: { area: AreaOfLaw }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getAreaColour(area))}>
      {AREA_LABELS[area]}
    </span>
  );
}
