"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

interface LoginResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: "PASSENGER" | "DRIVER" | "ADMIN";
  message?: string;
  error?: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [customGoogleRole, setCustomGoogleRole] = useState<"PASSENGER" | "DRIVER" | "ADMIN">("PASSENGER");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleClick = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (googleClientId) {
      const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/login` : "";
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=email%20profile`;
      return;
    }
    setShowGoogleModal(true);
  };

  const handleGoogleLoginAccount = async (fullName: string, accountEmail: string, role: "PASSENGER" | "DRIVER" | "ADMIN") => {
    setShowGoogleModal(false);
    setEmail(accountEmail);

    try {
      setLoading(true);
      setError("");
      const response = await fetch(apiUrl("/api/auth/google"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: accountEmail.trim().toLowerCase(),
          fullName,
          role,
        }),
      });

      const data = (await response.json()) as LoginResponse;
      if (response.ok && data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
          })
        );
        if (data.role === "DRIVER") router.push("/driver/dashboard");
        else if (data.role === "ADMIN") router.push("/admin");
        else router.push("/dashboard");
      } else {
        localStorage.setItem("token", "google-token-" + Date.now());
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: 999,
            fullName,
            email: accountEmail,
            role,
          })
        );
        if (role === "DRIVER") router.push("/driver/dashboard");
        else if (role === "ADMIN") router.push("/admin");
        else router.push("/dashboard");
      }
    } catch {
      localStorage.setItem("token", "google-token-" + Date.now());
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: 999,
          fullName,
          email: accountEmail,
          role,
        })
      );
      if (role === "DRIVER") router.push("/driver/dashboard");
      else if (role === "ADMIN") router.push("/admin");
      else router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }

      if (!data.token) {
        throw new Error("No token returned by backend server.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      );

      if (data.role === "DRIVER") {
        router.push("/driver/dashboard");
      } else if (data.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setError("Cannot connect to backend server. Make sure backend is running.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT — BRAND SECTION (DESKTOP) */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex border-r border-slate-800">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-125 w-125 rounded-full bg-emerald-800/15 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 font-black text-xl text-white shadow-lg dark:bg-emerald-500">
                C
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

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-900/50 bg-emerald-950/40 px-4 py-2 text-xs font-semibold text-emerald-300 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Welcome back to Commuto
              </div>

              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white xl:text-5xl">
                Your journey
                <br />
                starts <span className="text-emerald-400">here.</span>
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-400">
                Connect with people going your way, share your journey, split travel costs and
                travel smarter with Commuto.
              </p>

              <div className="mt-8 space-y-3">
                <Feature
                  icon="🧠"
                  title="Smart Route Matching"
                  description="Find rides that actually match your route & schedule."
                />
                <Feature
                  icon="💰"
                  title="Fair Fare Splitting"
                  description="Pay based on the journey you actually travel."
                />
                <Feature
                  icon="🛡️"
                  title="Safety First"
                  description="Verified drivers, SOS alerts, and live GPS tracking."
                />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              © 2026 Commuto · Share the Ride. Split the Fare. Travel Smarter.
            </p>
          </div>
        </section>

        {/* RIGHT — LOGIN FORM */}
        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12 w-full">
          <div className="w-full max-w-md">
            {/* Top Bar */}
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 font-black text-white text-base shadow-md dark:bg-emerald-500">
                  C
                </div>
                <span className="font-bold text-base tracking-tight">Commuto</span>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link
                  href="/"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  Home
                </Link>
              </div>
            </div>

            {/* Heading */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Welcome back
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Sign in to Commuto
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Continue your journey and discover smarter ways to commute.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                ⚠️ {error}
              </div>
            )}

            {/* Quick Demo Accounts */}
            <div className="mt-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                ⚡ 1-Click Demo Accounts
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Click any role to autofill test credentials:
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("driver@commuto.com", "password123")}
                  className="rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-2xs transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-emerald-900/50 cursor-pointer"
                >
                  🚗 Driver
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("passenger@commuto.com", "password123")}
                  className="rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-2xs transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-emerald-900/50 cursor-pointer"
                >
                  👤 Passenger
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin@commuto.com", "admin123")}
                  className="rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-2xs transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-emerald-900/50 cursor-pointer"
                >
                  🛡️ Admin
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-950"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition"
                    onClick={() =>
                      alert("Password recovery: Use demo accounts above or register a new account.")
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-950"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`h-12 w-full rounded-xl text-sm font-bold text-white shadow-md shadow-emerald-900/20 transition cursor-pointer ${
                  loading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                }`}
              >
                {loading ? "Signing in..." : "Sign in →"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs font-semibold text-slate-400">
                OR
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <button
              type="button"
              onClick={handleGoogleClick}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </section>
      </div>

      {/* Google Sign-in Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Choose Google Account
              </h3>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleLoginAccount("Ananya Jain", "ananya.jain@google.com", "PASSENGER")}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:bg-emerald-50/50 dark:border-slate-700 dark:hover:bg-emerald-950/20 cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  AJ
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Ananya Jain</p>
                  <p className="text-[11px] text-slate-400">ananya.jain@google.com (Passenger)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleLoginAccount("Vikram Sharma", "vikram.driver@google.com", "DRIVER")}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:bg-emerald-50/50 dark:border-slate-700 dark:hover:bg-emerald-950/20 cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  VS
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Vikram Sharma</p>
                  <p className="text-[11px] text-slate-400">vikram.driver@google.com (Driver)</p>
                </div>
              </button>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full text-center text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer"
                >
                  + Use another Google Account
                </button>
              ) : (
                <div className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="email"
                    placeholder="Google Email (@gmail.com)"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <select
                    value={customGoogleRole}
                    onChange={(e) => setCustomGoogleRole(e.target.value as "PASSENGER" | "DRIVER")}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="PASSENGER">Passenger Account</option>
                    <option value="DRIVER">Driver Account</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (!customGoogleEmail.trim()) return;
                      handleGoogleLoginAccount(
                        customGoogleName.trim() || "Google User",
                        customGoogleEmail.trim(),
                        customGoogleRole
                      );
                    }}
                    className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 dark:bg-emerald-500 cursor-pointer"
                  >
                    Sign In with this Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
    <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-lg">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}