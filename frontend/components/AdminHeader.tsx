"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function AdminHeader({
  title = "Admin Dashboard",
  subtitle,
  onOpenMobileMenu,
  breadcrumbs,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-400">
                {breadcrumbs.map((crumb, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    {idx > 0 && <span>/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-slate-700 dark:hover:text-slate-200">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-slate-700 dark:text-slate-300">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/dashboard"
            className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 sm:inline-flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            User Dashboard ↗
          </Link>
        </div>
      </div>
    </header>
  );
}
