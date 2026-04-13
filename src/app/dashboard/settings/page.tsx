import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ExternalLink, Users, Globe, Info } from "lucide-react";
import type { Metadata } from "next";
import { CopyButton } from "@/components/dashboard/copy-button";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, role, firm_id, firms(name, slug, contact_email, plan)")
    .eq("id", user.id)
    .single();

  type FirmRecord = {
  name?: string | null;
  slug?: string | null;
  contact_email?: string | null;
  plan?: string | null;
};

const firmData = profile?.firms as FirmRecord | FirmRecord[] | null | undefined;

const firm = Array.isArray(firmData)
  ? firmData[0] ?? null
  : firmData ?? null;

  const { data: colleagues } = await supabase
    .from("users")
    .select("id, full_name, role, created_at")
    .eq("firm_id", profile?.firm_id ?? "")
    .order("created_at");

  const intakeUrl = firm
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? "https://yourapp.com"}/intake/${firm.slug}`
    : "";

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage your firm&apos;s CaseCapture configuration.
        </p>
      </div>

      <div className="space-y-5">
        {/* Firm details */}
        <SettingsCard title="Firm Details" icon={Globe}>
          <div className="space-y-4">
            <Field label="Firm name" value={firm?.name ?? "—"} />
            <Field label="Contact email" value={firm?.contact_email ?? "Not set"} />
            <Field
              label="Plan"
              value={
                <span className="inline-flex items-center rounded-full bg-violet-50 border border-violet-200 text-violet-700 px-2.5 py-0.5 text-xs font-medium capitalize">
                  {firm?.plan ?? "trial"}
                </span>
              }
            />
          </div>
        </SettingsCard>

        {/* Intake URL */}
        <SettingsCard title="Your Intake Link" icon={ExternalLink}>
          <p className="text-sm text-slate-500 mb-4">
            Share this link with prospective clients, or embed it on your
            website. Anyone with this link can submit an enquiry directly to
            your dashboard.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 min-w-0">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-700 font-mono truncate">
                {intakeUrl}
              </span>
            </div>
            <CopyButton value={intakeUrl} />
            <a
              href={intakeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open
            </a>
          </div>
          <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3.5 py-2.5">
            <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              To embed on your website, add a link or button pointing to this
              URL. You can also share it directly with clients via email or SMS.
            </p>
          </div>
        </SettingsCard>

        {/* Team */}
        <SettingsCard title="Team" icon={Users}>
          <p className="text-sm text-slate-500 mb-4">
            Staff members with access to this firm&apos;s dashboard.
          </p>
          <div className="space-y-2">
            {(colleagues ?? []).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {c.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {c.full_name}
                      {c.id === user.id && (
                        <span className="ml-2 text-xs text-slate-400">(you)</span>
                      )}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500 capitalize bg-white border border-slate-200 rounded-full px-2.5 py-0.5">
                  {c.role}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">
            To add or remove team members, create users in your Supabase
            dashboard and link them to your firm. Full user management UI is
            coming in v2.
          </p>
        </SettingsCard>

        {/* Account */}
        <SettingsCard title="Your Account" icon={Users}>
          <div className="space-y-3">
            <Field label="Name" value={profile?.full_name ?? "—"} />
            <Field label="Email" value={user.email ?? "—"} />
            <Field label="Role" value={profile?.role ?? "staff"} />
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function SettingsCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
        <Icon className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <p className="text-sm text-slate-500 shrink-0">{label}</p>
      <div className="text-sm font-medium text-slate-800 text-right">
        {value}
      </div>
    </div>
  );
}
