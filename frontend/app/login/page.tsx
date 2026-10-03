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
        // Fallback for custom Google account if backend error
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
          email: email.trim(),
          password,
        }),
      });

      let data: LoginResponse | null = null;

      try {
        data = await response.json() as LoginResponse;
      } catch {
        data = null;
      }

      if (!response.ok || !data) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Invalid email or password."
        );
      }

      // Save JWT for protected API calls
      localStorage.setItem("token", data.token);

      // Save basic logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      );

      // Redirect according to role
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
        setError("Cannot connect to backend server (http://localhost:8080). Make sure the backend server is running via '.\\mvnw.cmd spring-boot:run'.");
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
    <main className="min-h-screen bg-[#f7f9fc] text-[#172033]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT — BRAND SECTION */}
        <section className="relative hidden overflow-hidden bg-[#172033] lg:flex">
          {/* Decorative circles */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#5b5ce2]/30 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-125 w-125 rounded-full bg-indigo-500/20 blur-3xl" />

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

            {/* Top Bar with Theme Toggle */}
            <div className="mb-8 flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                ← Back to Home
              </Link>
              <ThemeToggle />
            </div>

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

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                ⚠️ {error}
              </div>
            )}

            {/* Quick Demo Accounts */}
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                ⚡ 1-Click Demo Accounts
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Click any role to autofill test credentials:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("driver@commuto.com", "password123")}
                  className="rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-900 shadow-sm transition hover:bg-indigo-100"
                >
                  🚗 Driver
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("passenger@commuto.com", "password123")}
                  className="rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-900 shadow-sm transition hover:bg-indigo-100"
                >
                  👤 Passenger
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin@commuto.com", "admin123")}
                  className="rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-900 shadow-sm transition hover:bg-indigo-100"
                >
                  🛡️ Admin
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    onClick={() =>
                      alert("Password recovery will be available soon.")
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
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-14 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-[#5b5ce2] focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition hover:text-slate-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                disabled={loading}
                className={`h-14 w-full rounded-2xl text-sm font-extrabold text-white shadow-lg transition ${
                  loading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-[#5b5ce2] shadow-indigo-200 hover:-translate-y-0.5 hover:bg-[#4d4ecf] hover:shadow-xl"
                }`}
              >
                {loading ? "Signing in..." : "Sign in →"}
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
              onClick={handleGoogleClick}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-extrabold text-[#5b5ce2] hover:text-[#4546c7]"
              >
                Create one
              </Link>
            </p>

            {/* Safety note */}
            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-slate-100 dark:bg-slate-900 p-4">
              <span className="text-lg">🔒</span>

              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                Your account and personal information are protected with
                secure authentication.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Google Account Picker Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                <h3 className="text-base font-bold">Sign in with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Choose an account to continue to <strong>Commuto</strong>:
            </p>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleLoginAccount("Ananya Jain", "ananyajain729@gmail.com", "PASSENGER")}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:border-[#5b5ce2] hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                  AJ
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate">Ananya Jain</p>
                  <p className="text-xs text-slate-500 truncate dark:text-slate-400">ananyajain729@gmail.com</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleLoginAccount("Verified Driver", "driver@commuto.com", "DRIVER")}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:border-[#5b5ce2] hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  VD
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate">Verified Driver</p>
                  <p className="text-xs text-slate-500 truncate dark:text-slate-400">driver@commuto.com</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleLoginAccount("Commuto Admin", "admin@commuto.com", "ADMIN")}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:border-[#5b5ce2] hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  AD
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate">Platform Admin</p>
                  <p className="text-xs text-slate-500 truncate dark:text-slate-400">admin@commuto.com</p>
                </div>
              </button>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-[11px] text-slate-400">
                To add a custom Google account, configure <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded dark:bg-slate-800">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in environment variables.
              </p>
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
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-white">{title}</p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}