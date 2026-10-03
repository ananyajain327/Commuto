"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "./ThemeProvider";

const emptySubscribe = () => () => {};

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-2xl border border-stone-200 bg-white/80 p-1 backdrop-blur-md shadow-2xs dark:border-stone-800 dark:bg-stone-900/80 ${className}`}
        aria-hidden="true"
      >
        <span className="px-3 py-1 text-xs font-bold text-stone-400">Theme</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-2xl border border-stone-200 bg-white/80 p-1 backdrop-blur-md shadow-2xs transition-colors dark:border-stone-800 dark:bg-stone-900/80 ${className}`}
      role="group"
      aria-label="Theme switcher"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
          theme === "light"
            ? "bg-amber-700 text-white shadow-xs dark:bg-amber-600 dark:text-white"
            : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800"
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
            ? "bg-amber-700 text-white shadow-xs dark:bg-amber-600 dark:text-white"
            : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800"
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
            ? "bg-amber-700 text-white shadow-xs dark:bg-amber-600 dark:text-white"
            : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800"
        }`}
        title="System default"
      >
        <span>💻</span>
        <span className="hidden sm:inline">System</span>
      </button>
    </div>
  );
}
