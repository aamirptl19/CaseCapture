"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Search, X } from "lucide-react";
import { STATUS_LABELS, AREA_LABELS, URGENCY_LABELS } from "@/lib/utils";
import type { LeadStatus, AreaOfLaw, Urgency } from "@/types";

interface Props {
  currentParams: {
    status?: string;
    area?: string;
    urgency?: string;
    q?: string;
  };
}

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All statuses" },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

const AREA_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All areas" },
  ...Object.entries(AREA_LABELS).map(([value, label]) => ({ value, label })),
];

const URGENCY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All urgencies" },
  ...Object.entries(URGENCY_LABELS).map(([value, label]) => ({ value, label })),
];

export function StatusFilterBar({ currentParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams({
        ...(currentParams.status && currentParams.status !== "all" ? { status: currentParams.status } : {}),
        ...(currentParams.area && currentParams.area !== "all" ? { area: currentParams.area } : {}),
        ...(currentParams.urgency && currentParams.urgency !== "all" ? { urgency: currentParams.urgency } : {}),
        ...(currentParams.q ? { q: currentParams.q } : {}),
      });

      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [currentParams, pathname, router]
  );

  const hasFilters =
    (currentParams.status && currentParams.status !== "all") ||
    (currentParams.area && currentParams.area !== "all") ||
    (currentParams.urgency && currentParams.urgency !== "all") ||
    currentParams.q;

  return (
    <div className="mb-5 space-y-3">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or email…"
          defaultValue={currentParams.q ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            clearTimeout((window as unknown as { _searchTimer?: number })._searchTimer);
            (window as unknown as { _searchTimer?: number })._searchTimer = window.setTimeout(
              () => updateParam("q", val),
              350
            );
          }}
          className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-colors"
        />
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-2.5">
        <FilterSelect
          value={currentParams.status ?? "all"}
          options={STATUS_OPTIONS}
          onChange={(v) => updateParam("status", v)}
        />
        <FilterSelect
          value={currentParams.area ?? "all"}
          options={AREA_OPTIONS}
          onChange={(v) => updateParam("area", v)}
        />
        <FilterSelect
          value={currentParams.urgency ?? "all"}
          options={URGENCY_OPTIONS}
          onChange={(v) => updateParam("urgency", v)}
        />

        {hasFilters && (
          <button
            onClick={() => router.push(pathname)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-colors cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
