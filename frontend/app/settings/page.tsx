"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";

// ── types ──────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: "PASSENGER" | "DRIVER" | "ADMIN";
  active: boolean;
  verified: boolean;
  createdAt: string;
}

interface Preferences {
  womenOnly: boolean;
  rideNotifications: boolean;
  safetyNotifications: boolean;
  promotionalNotifications: boolean;
}

// ── helpers ────────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── page ───────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();

  // ── profile state ────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // ── preferences state ────────────────────────────────────────────────────────
  const [prefs, setPrefs] = useState<Preferences>({
    womenOnly: false,
    rideNotifications: true,
    safetyNotifications: true,
    promotionalNotifications: false,
  });
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsSuccess, setPrefsSuccess] = useState("");
  const [prefsError, setPrefsError] = useState("");

  // ── password state ───────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Save-on-change debounce ref
  const prefsSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── load both on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    // Load profile
    const loadProfile = async () => {
      try {
        const res = await fetch(apiUrl("/api/users/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Profile load failed (${res.status})`);
        const data: UserProfile = await res.json();
        setProfile(data);
        setEditName(data.fullName);
        setEditPhone(data.phone ?? "");
      } catch (e) {
        setProfileError(e instanceof Error ? e.message : "Could not load profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    // Load preferences
    const loadPrefs = async () => {
      try {
        const res = await fetch(apiUrl("/api/users/preferences"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Preferences load failed (${res.status})`);
        const data: Preferences = await res.json();
        setPrefs(data);
      } catch {
        // Use defaults silently — not critical
      } finally {
        setPrefsLoading(false);
      }
    };

    void loadProfile();
    void loadPrefs();
  }, [router]);

  // ── save profile ─────────────────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    if (!editName.trim() || !editPhone.trim()) {
      setProfileError("Full name and phone are required.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }

    try {
      setProfileSaving(true);
      const res = await fetch(apiUrl("/api/users/me"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: editName.trim(), phone: editPhone.trim() }),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      const updated: UserProfile = await res.json();
      setProfile(updated);
      setEditName(updated.fullName);
      setEditPhone(updated.phone ?? "");
      // Sync localStorage
      try {
        const stored = localStorage.getItem("user");
        if (stored)
          localStorage.setItem("user", JSON.stringify({ ...JSON.parse(stored), fullName: updated.fullName }));
      } catch { /* ignore */ }
      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setProfileSaving(false);
    }
  };

  // ── change password ──────────────────────────────────────────────────────────
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }

    try {
      setPasswordSaving(true);
      const res = await fetch(apiUrl("/api/users/me/password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Password change failed (${res.status})`);
      }

      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
      setTimeout(() => setPasswordSuccess(""), 4000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Unable to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  // ── toggle preference (auto-save with debounce) ───────────────────────────────
  const togglePref = (key: keyof Preferences) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);

    // Debounce: save 800ms after last toggle
    if (prefsSaveTimer.current) clearTimeout(prefsSaveTimer.current);
    prefsSaveTimer.current = setTimeout(() => {
      void savePrefsSilent(updated);
    }, 800);
  };

  const savePrefsSilent = async (data: Preferences) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    setPrefsError("");
    try {
      setPrefsSaving(true);
      const res = await fetch(apiUrl("/api/users/preferences"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      setPrefsSuccess("Preferences saved!");
      setTimeout(() => setPrefsSuccess(""), 3000);
    } catch (err) {
      setPrefsError(err instanceof Error ? err.message : "Could not save preferences.");
    } finally {
      setPrefsSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // ── derived ──────────────────────────────────────────────────────────────────
  const roleLabel =
    profile?.role === "DRIVER" ? "Driver" :
    profile?.role === "ADMIN" ? "Administrator" : "Passenger";

  const dashboardHref =
    profile?.role === "DRIVER" ? "/driver/dashboard" :
    profile?.role === "ADMIN" ? "/admin" : "/dashboard";

  const loading = profileLoading || prefsLoading;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#5b5ce2]" />
          <p className="text-sm font-semibold text-slate-500">Loading settings…</p>
        </div>
      </main>
    );
  }

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#172033]">

      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={dashboardHref}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            >
              ←
            </Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Account</p>
              <h1 className="mt-0.5 text-lg font-black">Settings</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {prefsSuccess && (
              <span className="hidden text-xs font-bold text-emerald-600 sm:block">
                ✅ {prefsSuccess}
              </span>
            )}
            {prefsSaving && (
              <span className="hidden text-xs font-semibold text-slate-400 sm:block">
                Saving…
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">

        {/* ── PROFILE CARD ───────────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-[32px] bg-[#172033] p-7 text-white shadow-[0_20px_50px_rgba(23,32,51,0.15)]">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-2xl font-black">
                {profile ? initials(profile.fullName) : "?"}
              </div>
              {profile?.verified && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#172033] bg-emerald-500 text-[10px]">
                  ✓
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">{roleLabel}</p>
              <h2 className="mt-0.5 text-xl font-black">{profile?.fullName}</h2>
              <p className="mt-0.5 text-sm text-slate-400">{profile?.email}</p>
            </div>
            <Link
              href="/profile"
              className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
            >
              View Profile →
            </Link>
          </div>
        </section>

        {/* ── PERSONAL INFORMATION ──────────────────────────────────────── */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Personal Info</p>
          <h2 className="mt-1 text-xl font-black">Update your details</h2>

          {profileSuccess && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              ✅ {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {profileError}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-[#5b5ce2] focus:bg-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Phone Number
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-[#5b5ce2] focus:bg-white"
              />
            </div>

            {/* Email (read-only) */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                value={profile?.email ?? ""}
                disabled
                className="w-full cursor-not-allowed rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-400 outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">Email cannot be changed.</p>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={profileSaving}
                className="w-full rounded-2xl bg-[#5b5ce2] py-3.5 text-sm font-extrabold text-white transition hover:bg-[#4d4ecf] disabled:opacity-60 sm:w-auto sm:px-10"
              >
                {profileSaving ? "Saving…" : "Save Profile"}
              </button>
            </div>
          </form>
        </section>

        {/* ── SECURITY & PASSWORD ─────────────────────────────────────────── */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Security</p>
              <h2 className="mt-1 text-xl font-black">Password & Authentication</h2>
            </div>
            {!showPasswordSection && (
              <button
                type="button"
                onClick={() => setShowPasswordSection(true)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                🔒 Change Password
              </button>
            )}
          </div>

          {passwordSuccess && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              ✅ {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {passwordError}
            </div>
          )}

          {showPasswordSection ? (
            <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-[#5b5ce2] focus:bg-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-[#5b5ce2] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-[#5b5ce2] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="rounded-2xl bg-[#5b5ce2] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#4d4ecf] disabled:opacity-60"
                >
                  {passwordSaving ? "Updating…" : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setPasswordError("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={passwordSaving}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Manage your password and protect your account against unauthorized access.
            </p>
          )}
        </section>

        {/* ── RIDE PREFERENCES ─────────────────────────────────────────────── */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Preferences</p>
              <h2 className="mt-1 text-xl font-black">Ride Preferences</h2>
              <p className="mt-1 text-xs text-slate-500">Changes save automatically.</p>
            </div>
            {prefsSaving && (
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold text-slate-400">
                Saving…
              </span>
            )}
            {prefsSuccess && !prefsSaving && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
                ✅ Saved
              </span>
            )}
          </div>

          {prefsError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {prefsError}
            </div>
          )}

          <div className="mt-6 divide-y divide-slate-100">
            <ToggleRow
              icon="👩"
              title="Women-only rides"
              description="Show and match only rides with women passengers and drivers."
              enabled={prefs.womenOnly}
              onChange={() => togglePref("womenOnly")}
            />
            <ToggleRow
              icon="🚗"
              title="Ride notifications"
              description="Get updates about your upcoming and active rides."
              enabled={prefs.rideNotifications}
              onChange={() => togglePref("rideNotifications")}
            />
            <ToggleRow
              icon="🛡️"
              title="Safety alerts"
              description="Receive important safety and emergency notifications."
              enabled={prefs.safetyNotifications}
              onChange={() => togglePref("safetyNotifications")}
            />
            <ToggleRow
              icon="📣"
              title="Promotional updates"
              description="Get offers, tips and news about Commuto."
              enabled={prefs.promotionalNotifications}
              onChange={() => togglePref("promotionalNotifications")}
            />
          </div>
        </section>

        {/* ── QUICK LINKS ──────────────────────────────────────────────────── */}
        <section className="grid gap-4 sm:grid-cols-2">
          <QuickLink icon="🛡️" title="Safety Center" description="Emergency contacts and SOS" href="/safety" />
          <QuickLink icon="🔔" title="Notifications" description="View your alerts" href="/notifications" />
          <QuickLink icon="💳" title="Wallet" description="Manage payments and fare splits" href="/wallet" />
          <QuickLink icon="⭐" title="Ratings" description="Your ride ratings and reviews" href="/ratings" />
        </section>

        {/* ── ACCOUNT ACTIONS ──────────────────────────────────────────────── */}
        <section className="rounded-[28px] border border-red-100 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">Danger Zone</p>
          <h2 className="mt-1 text-xl font-black">Account Actions</h2>
          <p className="mt-2 text-sm text-slate-500">
            Signing out will remove your session from this device.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-5 w-full rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-extrabold text-red-600 transition hover:bg-red-100"
          >
            Sign out of Commuto
          </button>
        </section>

        <footer className="pb-8 text-center">
          <p className="text-xs text-slate-400">
            Commuto · Share the Ride. Split the Fare. Travel Smarter.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ── sub-components ─────────────────────────────────────────────────────────────

function ToggleRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-4 py-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-extrabold">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
          enabled ? "bg-[#5b5ce2]" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? "translate-x-[22px]" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function QuickLink({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl transition group-hover:bg-indigo-50">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-extrabold">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-400">{description}</p>
      </div>
      <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#5b5ce2]">→</span>
    </Link>
  );
}