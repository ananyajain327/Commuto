"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/80 p-1 backdrop-blur-md shadow-2xs dark:border-slate-800 dark:bg-slate-900/80 ${className}`}
        aria-hidden="true"
      >
        <span className="px-3 py-1 text-xs font-bold text-slate-400">Theme</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/80 p-1 backdrop-blur-md shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-900/80 ${className}`}
      role="group"
      aria-label="Theme switcher"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
          theme === "light"
            ? "bg-slate-900 text-white shadow-xs dark:bg-emerald-600 dark:text-white"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
        }`}
        title="Light mode"
      >
        <span>☀️</span>
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
          theme === "dark"
            ? "bg-slate-900 text-white shadow-xs dark:bg-emerald-600 dark:text-white"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
        }`}
        title="Dark mode"
      >
        <span>🌙</span>
        <span className="hidden sm:inline">Dark</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
          theme === "system"
            ? "bg-slate-900 text-white shadow-xs dark:bg-emerald-600 dark:text-white"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
        }`}
        title="System default"
      >
        <span>💻</span>
        <span className="hidden sm:inline">System</span>
      </button>
    </div>
  );
}
