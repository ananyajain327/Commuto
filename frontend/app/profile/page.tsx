"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

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

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function joinDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(apiUrl("/api/users/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            router.replace("/login");
            return;
          }
          throw new Error("Unable to load profile.");
        }

        const data: UserProfile = await res.json();
        if (alive) {
          setProfile(data);
          setEditName(data.fullName);
          setEditPhone(data.phone ?? "");
          try {
            const stored = localStorage.getItem("user");
            if (stored) {
              const parsed = JSON.parse(stored);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...parsed, fullName: data.fullName })
              );
            }
          } catch {
            // ignore
          }
        }
      } catch (e) {
        if (alive)
          setErrorMsg(e instanceof Error ? e.message : "Unable to load profile.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    void load();
    return () => {
      alive = false;
    };
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!editName.trim() || !editPhone.trim()) {
      setErrorMsg("Full name and phone number are required.");
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) { router.replace("/login"); return; }

    try {
      setSaving(true);
      const res = await fetch(apiUrl("/api/users/me"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: editName.trim(), phone: editPhone.trim() }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Update failed (${res.status})`);
      }

      const updated: UserProfile = await res.json();
      setProfile(updated);
      setEditName(updated.fullName);
      setEditPhone(updated.phone ?? "");

      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...parsed, fullName: updated.fullName })
          );
        }
      } catch {
        // ignore
      }

      setEditing(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    if (profile) {
      setEditName(profile.fullName);
      setEditPhone(profile.phone ?? "");
    }
    setEditing(false);
    setErrorMsg("");
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const roleLabel =
    profile?.role === "DRIVER"
      ? "Driver"
      : profile?.role === "ADMIN"
      ? "Administrator"
      : "Passenger";

  const dashboardHref =
    profile?.role === "DRIVER"
      ? "/driver/dashboard"
      : profile?.role === "ADMIN"
      ? "/admin"
      : "/dashboard";

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f5] dark:bg-[#12100e]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-700 dark:border-stone-800 dark:border-t-amber-500" />
        <p className="mt-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Loading your profile…</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f5] dark:bg-[#12100e] px-6 text-center text-stone-900 dark:text-stone-100">
        <p className="text-xl font-bold text-red-600">Profile unavailable</p>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{errorMsg || "Something went wrong."}</p>
        <Link
          href="/login"
          className="mt-6 rounded-2xl bg-amber-700 px-6 py-3 text-sm font-extrabold text-white dark:bg-amber-600"
        >
          Back to Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors dark:bg-[#12100e] dark:text-stone-100">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur-xl dark:border-stone-800/80 dark:bg-stone-900/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={dashboardHref}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
            >
              ←
            </Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                Account
              </p>
              <h1 className="mt-0.5 text-lg font-black">My Profile</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 cursor-pointer shadow-2xs"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {successMsg && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            ✅ {successMsg}
          </div>
        )}

        {/* PROFILE HERO CARD */}
        <section className="mb-6 overflow-hidden rounded-4xl bg-[#1c1917] p-7 text-white shadow-xl">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-500/20 bg-amber-500/10 text-3xl font-black text-amber-300">
                {initials(profile.fullName)}
              </div>
              {profile.verified && (
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1c1917] bg-emerald-500 text-xs">
                  ✓
                </span>
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                {roleLabel}
              </p>
              <h2 className="mt-1 text-2xl font-black leading-tight">
                {profile.fullName}
              </h2>
              <p className="mt-1 text-sm text-stone-400">{profile.email}</p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div className="text-center">
              <p className="text-2xl font-black">
                {profile.active ? "Active" : "Inactive"}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Account Status
              </p>
            </div>
            <div className="border-x border-white/10 text-center">
              <p className="text-2xl font-black">
                {profile.verified ? "Verified" : "Unverified"}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Identity
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-black">{joinDate(profile.createdAt)}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Member Since
              </p>
            </div>
          </div>
        </section>

        {/* EDIT FORM */}
        <section className="mb-6 rounded-[28px] border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                Personal Info
              </p>
              <h2 className="mt-1 text-xl font-black">Profile details</h2>
            </div>
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 cursor-pointer shadow-2xs"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-amber-700 focus:bg-white dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:border-amber-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-amber-700 focus:bg-white dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:border-amber-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3.5 text-sm font-semibold text-stone-400 outline-none dark:border-stone-800 dark:bg-stone-800/40"
                />
                <p className="mt-1 text-xs text-stone-400">Email cannot be changed.</p>
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-amber-700 py-3.5 text-sm font-extrabold text-white transition hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 disabled:opacity-60 cursor-pointer shadow-2xs"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="flex-1 rounded-2xl border border-stone-200 bg-white py-3.5 text-sm font-extrabold text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-5">
              <ProfileField label="Full Name" value={profile.fullName} />
              <ProfileField label="Email Address" value={profile.email} />
              <ProfileField
                label="Phone Number"
                value={profile.phone || "Not provided"}
              />
              <ProfileField label="Account Role" value={roleLabel} />
            </div>
          )}
        </section>

        {/* QUICK LINKS */}
        <section className="grid gap-4 sm:grid-cols-2">
          <QuickLink
            icon="🛡️"
            title="Safety Center"
            description="Manage emergency contacts and SOS"
            href="/safety"
          />
          <QuickLink
            icon="⚙"
            title="Settings & Preferences"
            description="Notifications and account preferences"
            href="/settings"
          />
          <QuickLink
            icon="⭐"
            title="Ratings"
            description="View your ride ratings and reviews"
            href="/ratings"
          />
          <QuickLink
            icon="🚗"
            title={profile.role === "DRIVER" ? "Driver Dashboard" : "My Bookings"}
            description={
              profile.role === "DRIVER"
                ? "View and manage your offered rides"
                : "See all your past and upcoming rides"
            }
            href={profile.role === "DRIVER" ? "/driver/dashboard" : "/rides/my-requests"}
          />
        </section>

        {/* DANGER ZONE */}
        <section className="mt-6 rounded-[28px] border border-red-200/80 bg-white p-6 dark:border-red-900/60 dark:bg-stone-900 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">
            Account Actions
          </p>
          <h2 className="mt-1 text-xl font-black">Sign out</h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            You will be signed out of your Commuto account on this device.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-5 w-full rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-extrabold text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 cursor-pointer"
          >
            Sign out of Commuto
          </button>
        </section>

        <footer className="py-8 text-center">
          <p className="text-xs text-stone-400">
            Commuto · Share the Ride. Split the Fare. Travel Smarter.
          </p>
        </footer>
      </div>
    </main>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-stone-100 dark:border-stone-800 pt-4 first:border-t-0 first:pt-0">
      <p className="text-xs font-bold uppercase tracking-wider text-stone-400">{label}</p>
      <p className="text-right text-sm font-extrabold">{value}</p>
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
      className="group flex items-center gap-4 rounded-3xl border border-stone-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 shadow-2xs"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-xl transition group-hover:bg-amber-50 dark:bg-stone-800 dark:group-hover:bg-amber-950/60">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-extrabold text-stone-900 dark:text-white">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-stone-400">{description}</p>
      </div>
      <span className="text-stone-300 transition group-hover:translate-x-1 group-hover:text-amber-700 dark:group-hover:text-amber-400">
        →
      </span>
    </Link>
  );
}
