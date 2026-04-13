"use client";

import { type AreaOfLaw } from "@/types";
import { cn } from "@/lib/utils";
import {
  Heart,
  Home,
  Globe,
  Briefcase,
  Scale,
  Building,
  ChevronRight,
} from "lucide-react";

interface AreaOption {
  value: AreaOfLaw;
  label: string;
  description: string;
  icon: React.ElementType;
  colour: string;
  bg: string;
}

const AREAS: AreaOption[] = [
  {
    value: "family",
    label: "Family Law",
    description: "Divorce, children arrangements, financial remedy, domestic abuse",
    icon: Heart,
    colour: "text-pink-600",
    bg: "bg-pink-50 border-pink-200 hover:border-pink-400",
  },
  {
    value: "housing",
    label: "Housing",
    description: "Eviction, disrepair, deposit disputes, homelessness, tenancy issues",
    icon: Home,
    colour: "text-teal-600",
    bg: "bg-teal-50 border-teal-200 hover:border-teal-400",
  },
  {
    value: "immigration",
    label: "Immigration",
    description: "Visas, settlement, citizenship, appeals, asylum, deportation",
    icon: Globe,
    colour: "text-violet-600",
    bg: "bg-violet-50 border-violet-200 hover:border-violet-400",
  },
  {
    value: "employment",
    label: "Employment",
    description: "Dismissal, redundancy, discrimination, settlement agreements, tribunal",
    icon: Briefcase,
    colour: "text-orange-600",
    bg: "bg-orange-50 border-orange-200 hover:border-orange-400",
  },
  {
    value: "litigation",
    label: "Litigation / Disputes",
    description: "Contract disputes, debt recovery, negligence, personal injury, civil claims",
    icon: Scale,
    colour: "text-rose-600",
    bg: "bg-rose-50 border-rose-200 hover:border-rose-400",
  },
  {
    value: "conveyancing",
    label: "Conveyancing / Property",
    description: "Property purchase, sale, remortgage, lease extension, transfer of equity",
    icon: Building,
    colour: "text-sky-600",
    bg: "bg-sky-50 border-sky-200 hover:border-sky-400",
  },
];

interface Props {
  selected: AreaOfLaw | "";
  onSelect: (area: AreaOfLaw) => void;
  onNext: () => void;
}

export function Step1Area({ selected, onSelect, onNext }: Props) {
  return (
    <div>
      <h2 className="font-display text-2xl text-slate-900 mb-1">
        What area of law does your matter relate to?
      </h2>
      <p className="text-slate-500 text-sm mb-7">
        Select the option that best matches your situation. You can describe the details in the next steps.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {AREAS.map((area) => {
          const Icon = area.icon;
          const isSelected = selected === area.value;
          return (
            <button
              key={area.value}
              type="button"
              onClick={() => onSelect(area.value)}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                area.bg,
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 border-primary"
                  : "border-transparent"
              )}
            >
              <div className={cn("w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm border border-white", area.colour)}>
                <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              </div>
              <div className="min-w-0">
                <p className={cn("text-sm font-semibold mb-0.5", area.colour)}>{area.label}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{area.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!selected}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
