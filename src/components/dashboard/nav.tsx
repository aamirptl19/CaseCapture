"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavProps {
  firmName: string;
  userFullName: string;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Leads", icon: LayoutDashboard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardNav({ firmName, userFullName }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[hsl(221,65%,17%)] text-white shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">CaseCapture</p>
            <p className="text-sm font-medium text-white truncate">{firmName}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
              {userFullName.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm text-white/80 truncate flex-1">{userFullName}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:bg-white/8 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile topbar ────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 bg-[hsl(221,65%,17%)] text-white shadow-md">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5" />
          <span className="text-sm font-semibold">{firmName}</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-14">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-[hsl(221,65%,17%)] w-72 min-h-full flex flex-col">
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                </Link>
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-white/10">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
