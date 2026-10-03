"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "./ThemeProvider";

const emptySubscribe = () => () => {};

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`inline-flex h-9 w-20 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 p-1 text-xs font-semibold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
        aria-hidden="true"
      >
        Theme
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex h-9 items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-xs ${
        isDark
          ? "border-violet-800/70 bg-violet-950/40 text-violet-300 hover:border-violet-600 hover:bg-violet-900/50 shadow-violet-950/30"
          : "border-slate-300/90 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
      } ${className}`}
      role="switch"
      aria-checked={isDark}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span className="text-sm transition-transform duration-200 group-hover:scale-110">
        {isDark ? "🌙" : "☀️"}
      </span>
      <span className="font-extrabold tracking-wide">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
