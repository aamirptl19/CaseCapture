import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  formatDate,
  AREA_LABELS,
  URGENCY_LABELS,
  STATUS_LABELS,
  getStatusColour,
  getTriageColour,
  getUrgencyColour,
  getAreaColour,
  TRIAGE_LABELS,
  cn,
} from "@/lib/utils";
import type { Lead, AiSummary, TriageLabel, LeadStatus, AreaOfLaw, Urgency } from "@/types";
import { StatusFilterBar } from "@/components/dashboard/status-filter-bar";
import { ArrowUpRight, Users, Clock, CheckCircle, TrendingUp } from "lucide-react";

// Allow dynamic search params for filtering
export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  area?: string;
  urgency?: string;
  q?: string;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Build query with optional filters
  let query = supabase
    .from("leads")
    .select(`
      *,
      ai_summaries (triage_label, next_step)
    `)
    .order("created_at", { ascending: false });

  if (searchParams.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status);
  }
  if (searchParams.area && searchParams.area !== "all") {
    query = query.eq("area_of_law", searchParams.area);
  }
  if (searchParams.urgency && searchParams.urgency !== "all") {
    query = query.eq("urgency", searchParams.urgency);
  }
  if (searchParams.q) {
    query = query.or(`full_name.ilike.%${searchParams.q}%,email.ilike.%${searchParams.q}%`);
  }

  const { data: leads } = await query;

  // Stats — always from full dataset (no filters)
  const { data: allLeads } = await supabase
    .from("leads")
    .select("status, created_at");

  const stats = {
    total: allLeads?.length ?? 0,
    new: allLeads?.filter((l) => l.status === "new").length ?? 0,
    qualified: allLeads?.filter((l) => l.status === "qualified").length ?? 0,
    booked: allLeads?.filter((l) => l.status === "booked").length ?? 0,
  };

  type LeadRow = Lead & { ai_summaries?: Pick<AiSummary, "triage_label" | "next_step"> | null };
  const typedLeads = (leads ?? []) as LeadRow[];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-slate-900">Leads</h1>
        <p className="text-slate-500 mt-1 text-sm">
          All enquiries submitted through your intake form.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Leads" value={stats.total} colour="text-slate-700" />
        <StatCard icon={Clock} label="Awaiting Review" value={stats.new} colour="text-sky-700" highlight />
        <StatCard icon={TrendingUp} label="Qualified" value={stats.qualified} colour="text-emerald-700" />
        <StatCard icon={CheckCircle} label="Booked" value={stats.booked} colour="text-violet-700" />
      </div>

      {/* Filters */}
      <StatusFilterBar currentParams={searchParams} />

      {/* Leads table */}
      {typedLeads.length === 0 ? (
        <EmptyState hasFilters={!!searchParams.status || !!searchParams.area || !!searchParams.q} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Area</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Urgency</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Triage</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Received</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {typedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{lead.full_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{lead.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", getAreaColour(lead.area_of_law as AreaOfLaw))}>
                        {AREA_LABELS[lead.area_of_law as AreaOfLaw] ?? lead.area_of_law}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", getUrgencyColour(lead.urgency as Urgency))}>
                        {URGENCY_LABELS[lead.urgency as Urgency] ?? lead.urgency}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {lead.ai_summaries?.triage_label ? (
                        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", getTriageColour(lead.ai_summaries.triage_label as TriageLabel))}>
                          {TRIAGE_LABELS[lead.ai_summaries.triage_label as TriageLabel]}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Processing…</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", getStatusColour(lead.status as LeadStatus))}>
                        {STATUS_LABELS[lead.status as LeadStatus] ?? lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {typedLeads.map((lead) => (
              <Link key={lead.id} href={`/dashboard/leads/${lead.id}`} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-slate-900 text-sm">{lead.full_name}</p>
                    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium", getStatusColour(lead.status as LeadStatus))}>
                      {STATUS_LABELS[lead.status as LeadStatus]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{lead.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", getAreaColour(lead.area_of_law as AreaOfLaw))}>
                      {AREA_LABELS[lead.area_of_law as AreaOfLaw]}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(lead.created_at)}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 mt-1 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-4">
        Showing {typedLeads.length} lead{typedLeads.length !== 1 ? "s" : ""}
        {searchParams.status && searchParams.status !== "all" ? ` with status: ${STATUS_LABELS[searchParams.status as LeadStatus]}` : ""}
      </p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  colour,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  colour: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn("bg-white rounded-xl border p-5 shadow-sm", highlight ? "border-sky-200" : "border-slate-200")}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <Icon className={cn("w-4 h-4", colour)} />
      </div>
      <p className={cn("text-3xl font-bold font-display", colour)}>{value}</p>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Users className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="font-semibold text-slate-800 mb-1">
        {hasFilters ? "No leads match these filters" : "No leads yet"}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm">
        {hasFilters
          ? "Try adjusting or clearing your filters."
          : "Leads will appear here once clients submit your intake form."}
      </p>
      {hasFilters && (
        <Link
          href="/dashboard"
          className="mt-5 text-sm font-medium text-primary hover:underline"
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}
