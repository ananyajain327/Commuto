"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Backend authentication will be connected here later.
    console.log("Login submitted");
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#172033]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT — BRAND SECTION */}
        <section className="relative hidden overflow-hidden bg-[#172033] lg:flex">
          {/* Decorative circles */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#5b5ce2]/30 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-lg">
                🚗
              </div>

              <div>
                <p className="text-xl font-extrabold tracking-tight text-white">
                  Commuto
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Smart Mobility
                </p>
              </div>
            </Link>

            {/* Main content */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Welcome back to Commuto
              </div>

              <h1 className="text-5xl font-black leading-[1.08] tracking-[-0.04em] text-white xl:text-6xl">
                Your journey
                <br />
                starts <span className="text-indigo-400">here.</span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-slate-400">
                Connect with people going your way, share your journey and
                travel smarter with Commuto.
              </p>

              {/* Feature cards */}
              <div className="mt-10 space-y-3">
                <Feature
                  icon="🧠"
                  title="Smart matching"
                  description="Find rides that actually match your route."
                />

                <Feature
                  icon="💰"
                  title="Fair fare splitting"
                  description="Pay based on the journey you actually travel."
                />

                <Feature
                  icon="🛡️"
                  title="Safety first"
                  description="Verified drivers, SOS and trip protection."
                />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              © 2026 Commuto · Share the Ride. Split the Fare. Travel Smarter.
            </p>
          </div>
        </section>

        {/* RIGHT — LOGIN */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <Link
              href="/"
              className="mb-12 flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#172033] text-xl shadow-lg">
                🚗
              </div>

              <div>
                <p className="text-xl font-extrabold">Commuto</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Smart Mobility
                </p>
              </div>
            </Link>

            {/* Heading */}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5b5ce2]">
                Welcome back
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Sign in to Commuto
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Continue your journey and discover smarter ways to commute.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-9 space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-[#5b5ce2] focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-bold text-[#5b5ce2] transition hover:text-[#4546c7]"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-14 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-[#5b5ce2] focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition hover:text-slate-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-3">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-[#5b5ce2]"
                />

                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-slate-500"
                >
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="h-14 w-full rounded-2xl bg-[#5b5ce2] text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#4d4ecf] hover:shadow-xl"
              >
                Sign in →
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400">
                OR
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google button */}
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <span className="text-lg font-black">G</span>
              Continue with Google
            </button>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-extrabold text-[#5b5ce2] hover:text-[#4546c7]"
              >
                Create one
              </Link>
            </p>

            {/* Safety note */}
            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-slate-100 p-4">
              <span className="text-lg">🔒</span>

              <p className="text-xs leading-5 text-slate-500">
                Your account and personal information are protected with
                secure authentication.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}