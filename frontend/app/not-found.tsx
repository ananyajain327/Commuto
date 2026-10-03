import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <div className="w-full max-w-xl text-center">
        {/* Top Toggle */}
        <div className="mb-6 flex justify-center">
          <ThemeToggle />
        </div>

        {/* Badge */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span>Error 404 · Route Not Found</span>
        </div>

        {/* Big visual number */}
        <div className="mt-8 select-none">
          <h1 className="text-8xl font-black tracking-tight text-slate-900 dark:text-white sm:text-9xl">
            4<span className="text-emerald-500">0</span>4
          </h1>
        </div>

        {/* Headings */}
        <h2 className="mt-4 text-2xl font-black sm:text-3xl text-slate-900 dark:text-slate-100">
          Looks like this road took a wrong turn
        </h2>
        <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          The page or trip you were looking for doesn&apos;t exist, has been moved, or the link might be broken.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-500 active:scale-95 cursor-pointer"
          >
            <span>🏠</span> Go to Dashboard
          </Link>
          <Link
            href="/rides/search"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <span>🔍</span> Find Rides
          </Link>
        </div>

        {/* Quick Route Cards */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3 text-left">
          <Link
            href="/rides"
            className="group rounded-3xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600"
          >
            <span className="text-xl">🚗</span>
            <p className="mt-2 text-sm font-black text-slate-900 dark:text-slate-100">My Rides</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">View upcoming bookings</p>
          </Link>

          <Link
            href="/safety"
            className="group rounded-3xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600"
          >
            <span className="text-xl">🛡️</span>
            <p className="mt-2 text-sm font-black text-slate-900 dark:text-slate-100">Safety Center</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Emergency & contacts</p>
          </Link>

          <Link
            href="/settings"
            className="group rounded-3xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600"
          >
            <span className="text-xl">⚙️</span>
            <p className="mt-2 text-sm font-black text-slate-900 dark:text-slate-100">Settings</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Preferences & account</p>
          </Link>
        </div>

        {/* Footer info */}
        <p className="mt-12 text-xs font-semibold text-slate-400 dark:text-slate-600">
          Commuto · Share the Ride. Split the Fare. Travel Smarter.
        </p>
      </div>
    </main>
  );
}
