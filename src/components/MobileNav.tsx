"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const clientTabs = [
  { href: "/dashboard", label: "Home", icon: "📊" },
  { href: "/dashboard/weight", label: "Weight", icon: "⚖️" },
  { href: "/dashboard/exercise", label: "Exercise", icon: "🏋️" },
  { href: "/dashboard/food", label: "Food", icon: "🍎" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

const adminTabs = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/clients", label: "Clients", icon: "👥" },
  { href: "/admin/invite", label: "Invite", icon: "📨" },
  { href: "/admin/export", label: "Export", icon: "📥" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdminView = pathname.startsWith("/admin");
  const tabs = isAdminView ? adminTabs : clientTabs;
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border md:hidden z-50 pb-safe">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${
              pathname === tab.href ? "text-gold" : "text-dark-muted"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        ))}
        {isAdmin && (
          <Link
            href={isAdminView ? "/dashboard" : "/admin"}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-dark-muted"
          >
            <span className="text-lg">🔄</span>
            <span>{isAdminView ? "Client" : "Coach"}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
