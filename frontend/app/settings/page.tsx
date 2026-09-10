"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [rideUpdates, setRideUpdates] = useState(true);
  const [safetyAlerts, setSafetyAlerts] = useState(true);
  const [womenPreference, setWomenPreference] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Profile & Settings</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your profile, preferences and account security.
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                AJ
              </div>

              <h2 className="mt-4 text-xl font-bold">Ananya Jain</h2>

              <p className="mt-1 text-sm text-slate-500">
                Passenger • Commuto Member
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                ✓ Profile Verified
              </div>
            </div>

            <div className="mt-7 space-y-4 border-t border-slate-100 pt-6">
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="mt-1 text-sm font-medium">
                  ananya@example.com
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="mt-1 text-sm font-medium">+91 XXXXX XXXXX</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Member Since</p>
                <p className="mt-1 text-sm font-medium">September 2026</p>
              </div>
            </div>

            <button className="mt-6 w-full rounded-xl border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
              Edit Profile
            </button>
          </section>

          {/* Settings */}
          <section className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">Personal Information</h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    defaultValue="Ananya Jain"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    defaultValue="+91 XXXXX XXXXX"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    defaultValue="ananya@example.com"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </div>

            {/* Ride Preferences */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">Ride Preferences</h2>

              <div className="mt-5 divide-y divide-slate-100">
                <SettingRow
                  title="Women-only rides"
                  description="Prefer rides with women passengers and drivers."
                  enabled={womenPreference}
                  onChange={() =>
                    setWomenPreference(!womenPreference)
                  }
                />

                <SettingRow
                  title="Ride notifications"
                  description="Receive updates about your upcoming rides."
                  enabled={rideUpdates}
                  onChange={() => setRideUpdates(!rideUpdates)}
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">Notifications</h2>

              <div className="mt-5 divide-y divide-slate-100">
                <SettingRow
                  title="Push notifications"
                  description="Get important Commuto notifications."
                  enabled={notifications}
                  onChange={() => setNotifications(!notifications)}
                />

                <SettingRow
                  title="Safety alerts"
                  description="Receive important safety and emergency alerts."
                  enabled={safetyAlerts}
                  onChange={() => setSafetyAlerts(!safetyAlerts)}
                />
              </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">Security</h2>

              <div className="mt-5 space-y-3">
                <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50">
                  <div>
                    <p className="text-sm font-semibold">Change Password</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Update your account password.
                    </p>
                  </div>

                  <span>→</span>
                </button>

                <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50">
                  <div>
                    <p className="text-sm font-semibold">
                      Two-Factor Authentication
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Add an extra layer of account protection.
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Not Enabled
                  </span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-red-700">
                Account Actions
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                These actions affect your Commuto account.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">
                  Log Out
                </button>

                <button className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Delete Account
                </button>
              </div>
            </div>

            {/* Save */}
            <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">
              {saved && (
                <span className="text-sm font-medium text-emerald-600">
                  ✓ Settings saved successfully
                </span>
              )}

              <button
                onClick={handleSave}
                className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}