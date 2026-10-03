import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f7f9fc] px-6 py-12 text-[#172033]">
      <div className="w-full max-w-xl text-center">
        {/* Badge */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-[#5b5ce2] shadow-sm backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#5b5ce2]" />
          <span>Error 404 · Route Not Found</span>
        </div>

        {/* Big visual number */}
        <div className="mt-8 select-none">
          <h1 className="text-8xl font-black tracking-tight text-[#172033] sm:text-9xl">
            4<span className="text-[#5b5ce2]">0</span>4
          </h1>
        </div>

        {/* Headings */}
        <h2 className="mt-4 text-2xl font-black sm:text-3xl">
          Looks like this road took a wrong turn
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
          The page or trip you were looking for doesn&apos;t exist, has been moved, or the link might be broken.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#172033] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 active:scale-95"
          >
            <span>🏠</span> Go to Dashboard
          </Link>
          <Link
            href="/rides/search"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            <span>🔍</span> Find Rides
          </Link>
        </div>

        {/* Quick Route Cards */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3 text-left">
          <Link
            href="/rides"
            className="group rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
          >
            <span className="text-xl">🚗</span>
            <p className="mt-2 text-sm font-bold text-slate-900">My Rides</p>
            <p className="text-[11px] text-slate-400">View upcoming bookings</p>
          </Link>

          <Link
            href="/safety"
            className="group rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
          >
            <span className="text-xl">🛡️</span>
            <p className="mt-2 text-sm font-bold text-slate-900">Safety Center</p>
            <p className="text-[11px] text-slate-400">Emergency & contacts</p>
          </Link>

          <Link
            href="/settings"
            className="group rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
          >
            <span className="text-xl">⚙️</span>
            <p className="mt-2 text-sm font-bold text-slate-900">Settings</p>
            <p className="text-[11px] text-slate-400">Preferences & account</p>
          </Link>
        </div>

        {/* Footer info */}
        <p className="mt-12 text-xs font-semibold text-slate-400">
          Commuto · Share the Ride. Split the Fare. Travel Smarter.
        </p>
      </div>
    </main>
  );
}
