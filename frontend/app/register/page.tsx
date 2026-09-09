"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"PASSENGER" | "DRIVER">("PASSENGER");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Backend registration will be connected later.
    console.log("Registration submitted", { role });
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#172033]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-[#172033] lg:flex">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#5b5ce2]/30 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-lg">
                🚗
              </div>

              <div>
                <p className="text-xl font-extrabold text-white">
                  Commuto
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Smart Mobility
                </p>
              </div>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Join the Commuto community
              </div>

              <h1 className="text-5xl font-black leading-[1.08] tracking-[-0.04em] text-white xl:text-6xl">
                One platform.
                <br />
                <span className="text-indigo-400">Smarter journeys.</span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-slate-400">
                Whether you're looking for a ride or offering one, Commuto
                helps you connect with people traveling your way.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-3">
                <InfoCard icon="🧠" title="Smart matching" />
                <InfoCard icon="💰" title="Fair fares" />
                <InfoCard icon="📍" title="Live tracking" />
                <InfoCard icon="🛡️" title="Safer rides" />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Share the Ride. Split the Fare. Travel Smarter.
            </p>
          </div>
        </section>

        {/* REGISTER FORM */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <Link
              href="/"
              className="mb-10 flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#172033] text-xl">
                🚗
              </div>

              <div>
                <p className="text-xl font-extrabold">Commuto</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Smart Mobility
                </p>
              </div>
            </Link>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5b5ce2]">
                Get started
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Create your account
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Join Commuto and start travelling smarter.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#5b5ce2] focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* EMAIL */}
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
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#5b5ce2] focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#5b5ce2] focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  How will you use Commuto?
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => setRole("PASSENGER")}
                    className={`rounded-2xl border p-4 text-left transition ${
                      role === "PASSENGER"
                        ? "border-[#5b5ce2] bg-indigo-50 ring-2 ring-indigo-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xl">🧑</div>

                    <p className="mt-2 text-sm font-extrabold">
                      Passenger
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Find rides
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("DRIVER")}
                    className={`rounded-2xl border p-4 text-left transition ${
                      role === "DRIVER"
                        ? "border-[#5b5ce2] bg-indigo-50 ring-2 ring-indigo-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xl">🚗</div>

                    <p className="mt-2 text-sm font-extrabold">
                      Driver
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Offer rides
                    </p>
                  </button>

                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Create a strong password"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-14 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#5b5ce2] focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use at least 8 characters.
                </p>
              </div>

              {/* TERMS */}
              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 accent-[#5b5ce2]"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-slate-500"
                >
                  I agree to Commuto's Terms of Service and Privacy Policy.
                </label>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="h-14 w-full rounded-2xl bg-[#5b5ce2] text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#4d4ecf] hover:shadow-xl"
              >
                Create account →
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-extrabold text-[#5b5ce2] hover:text-[#4546c7]"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-7 flex items-start gap-3 rounded-2xl bg-slate-100 p-4">
              <span>🔒</span>

              <p className="text-xs leading-5 text-slate-500">
                Your information is securely stored. Driver verification will
                be required before offering rides.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xl">{icon}</div>
      <p className="mt-3 text-sm font-bold text-white">{title}</p>
    </div>
  );
}