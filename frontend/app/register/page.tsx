"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"PASSENGER" | "DRIVER">("PASSENGER");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          role,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = `Registration failed (${response.status})`;
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage =
              errorData.message ||
              errorData.error ||
              responseText ||
              errorMessage;
          } catch {
            errorMessage = responseText;
          }
        }
        throw new Error(errorMessage);
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while creating your account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors dark:bg-[#12100e] dark:text-stone-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#faf8f5]/90 px-6 py-3.5 backdrop-blur-md dark:border-stone-800/80 dark:bg-[#12100e]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 font-bold text-lg text-white shadow-2xs transition group-hover:scale-105 dark:bg-amber-600">
              C
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-stone-900 dark:text-white">
                Commuto
              </span>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                Smart Mobility
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 transition shadow-2xs"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-10 shadow-xl dark:border-stone-800 dark:bg-stone-900">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
              <span>🚀</span> Join the Commuto Community
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Start sharing rides, splitting costs, and connecting with verified commuters.
            </p>
          </div>

          {/* Feedback banners */}
          {error && (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              ✅ {success}
            </div>
          )}

          {/* Role selector */}
          <div className="mt-6">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Choose your role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("PASSENGER")}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition cursor-pointer ${
                  role === "PASSENGER"
                    ? "border-amber-700 bg-amber-50/60 text-amber-900 shadow-xs dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-200"
                    : "border-stone-200 bg-stone-50/50 text-stone-600 hover:bg-stone-100/70 dark:border-stone-800 dark:bg-stone-800/40 dark:text-stone-300 dark:hover:bg-stone-800/80"
                }`}
              >
                <span className="text-xl">👤</span>
                <span className="mt-2 text-sm font-black">Passenger</span>
                <span className="mt-0.5 text-[11px] opacity-75">I want to book and share rides</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("DRIVER")}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition cursor-pointer ${
                  role === "DRIVER"
                    ? "border-amber-700 bg-amber-50/60 text-amber-900 shadow-xs dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-200"
                    : "border-stone-200 bg-stone-50/50 text-stone-600 hover:bg-stone-100/70 dark:border-stone-800 dark:bg-stone-800/40 dark:text-stone-300 dark:hover:bg-stone-800/80"
                }`}
              >
                <span className="text-xl">🚗</span>
                <span className="mt-2 text-sm font-black">Driver</span>
                <span className="mt-0.5 text-[11px] opacity-75">I have a car and want to offer seats</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-stone-700 dark:text-stone-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Jain"
                className="h-12 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-100 dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-amber-500 dark:focus:ring-amber-950"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-100 dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-amber-500 dark:focus:ring-amber-950"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-100 dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-amber-500 dark:focus:ring-amber-950"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-stone-700 dark:text-stone-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-3.5 pr-12 text-sm font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-100 dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-amber-500 dark:focus:ring-amber-950"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`h-12 w-full rounded-xl text-sm font-extrabold text-white shadow-md shadow-amber-900/20 transition cursor-pointer ${
                loading
                  ? "cursor-not-allowed bg-stone-400"
                  : "bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 active:scale-95"
              }`}
            >
              {loading ? "Creating your account..." : "Complete Registration →"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 transition"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/50 py-6 text-center text-xs text-stone-400 dark:border-stone-800 dark:bg-stone-900/40">
        © 2026 Commuto · Smart Mobility & Safe Carpooling.
      </footer>
    </main>
  );
}