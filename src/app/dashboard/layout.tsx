import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/nav";
import { ToastContextProvider } from "@/components/ui/toast";

export const metadata = { title: "Dashboard" };

type FirmRecord = {
  name?: string | null;
};

type UserProfile = {
  full_name?: string | null;
  firm_id?: string | null;
  firms?: FirmRecord | FirmRecord[] | null;
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, firm_id, firms(name)")
    .eq("id", user.id)
    .single();

  const typedProfile = profile as UserProfile | null;
  const firms = typedProfile?.firms;

  const firmName = Array.isArray(firms)
    ? firms[0]?.name ?? "Your Firm"
    : firms?.name ?? "Your Firm";

  const userFullName = typedProfile?.full_name ?? "User";

  return (
    <ToastContextProvider>
      <div className="flex min-h-screen bg-slate-50">
        <DashboardNav firmName={firmName} userFullName={userFullName} />
        <main className="flex-1 min-w-0 lg:pt-0 pt-14">{children}</main>
      </div>
    </ToastContextProvider>
  );
}
