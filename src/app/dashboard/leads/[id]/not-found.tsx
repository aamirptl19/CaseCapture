import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function LeadNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-5">
        <SearchX className="w-7 h-7 text-slate-400" />
      </div>
      <h1 className="font-display text-2xl text-slate-900 mb-2">Lead not found</h1>
      <p className="text-slate-500 text-sm max-w-sm mb-6">
        This lead doesn&apos;t exist or you don&apos;t have permission to view it.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>
    </div>
  );
}
