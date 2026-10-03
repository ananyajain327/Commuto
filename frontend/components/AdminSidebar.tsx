"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Users", href: "/admin/users", icon: "👥" },
  { name: "Drivers", href: "/admin/drivers", icon: "🚗" },
  { name: "Rides", href: "/admin/rides", icon: "🛣️" },
  { name: "Complaints", href: "/admin/complaints", icon: "📋" },
  { name: "Verifications", href: "/admin/verifications", icon: "✅" },
  { name: "Analytics", href: "/admin/analytics", icon: "📈" },
  { name: "Reports & SOS", href: "/admin/fraud", icon: "🚨" },
  { name: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && onClose && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-md shadow-slate-900/10 dark:bg-emerald-600 dark:shadow-emerald-950/20">
                C
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Commuto</p>
                <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                  Admin Panel
                </p>
              </div>
            </Link>

            {onClose && (
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm dark:bg-emerald-600 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Admin Profile */}
          <div className="border-t border-slate-100 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-emerald-600">
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  Commuto Admin
                </p>
                <p className="truncate text-xs text-slate-400">admin@commuto.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
