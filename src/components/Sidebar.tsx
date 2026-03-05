"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const clientLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/weight", label: "Weight", icon: "⚖️" },
  { href: "/dashboard/exercise", label: "Exercise", icon: "🏋️" },
  { href: "/dashboard/food", label: "Food", icon: "🍎" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

const adminLinks = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/clients", label: "Clients", icon: "👥" },
  { href: "/admin/invite", label: "Invite", icon: "📨" },
  { href: "/admin/export", label: "Export", icon: "📥" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isAdminView = pathname.startsWith("/admin");
  const links = isAdminView ? adminLinks : clientLinks;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-card border-r border-dark-border flex flex-col z-50">
      <div className="p-6 border-b border-dark-border">
        <span
          className="text-gold text-lg font-bold tracking-wider"
          style={{ fontFamily: "var(--font-display)" }}
        >
          1 Level Up
        </span>
        <p className="text-dark-muted text-xs mt-1">
          {isAdminView ? "Coach Portal" : "Client Portal"}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              pathname === link.href
                ? "bg-gold/10 text-gold"
                : "text-dark-muted hover:text-dark-text hover:bg-dark-surface"
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {isAdmin && (
        <div className="p-4 border-t border-dark-border">
          <Link
            href={isAdminView ? "/dashboard" : "/admin"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dark-muted hover:text-gold transition-colors"
          >
            <span>🔄</span>
            <span>
              Switch to {isAdminView ? "Client" : "Coach"} View
            </span>
          </Link>
        </div>
      )}

      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-3 px-3 mb-3">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-bold">
              {session?.user?.name?.[0] || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{session?.user?.name}</p>
            <p className="text-xs text-dark-muted truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-dark-muted hover:text-red-500 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
