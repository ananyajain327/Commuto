"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    newRide: true,
    complaints: true,
    verification: true,
    fraud: true,
    system: false,
  });

  const [settings, setSettings] = useState({
    platformName: "Commuto",
    supportEmail: "support@commuto.com",
    commission: "10",
    minFare: "50",
    maxPassengers: "4",
    riskThreshold: "70",
    autoVerification: false,
    maintenanceMode: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              C
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">Commuto</h1>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span>📊</span>
              Overview
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span>👥</span>
              Users
            </Link>

            <Link
              href="/admin/drivers"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span>🚗</span>
              Drivers
            </Link>

            <Link
              href="/admin/verifications"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span>✓</span>
              Verifications
            </Link>

            <Link
              href="/admin/rides"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span>🛣️</span>
              Rides
            </Link>

            <Link
              href="/admin/complaints"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span>⚠️</span>
              Complaints
            </Link>

            <Link
              href="/admin/fraud"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span>🛡️</span>
              Fraud & Risk
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span>📈</span>
              Analytics
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700"
            >
              <span>⚙️</span>
              Settings
            </Link>
          </nav>

          {/* Admin Profile */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Admin User</p>
                <p className="truncate text-xs text-slate-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <div>
            <p className="text-sm text-slate-500">Administration</p>
            <h2 className="text-xl font-bold text-slate-900">
              Platform Settings
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                ✓ Changes saved
              </div>
            )}

            <button
              onClick={handleSave}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </header>

        <div className="space-y-6 p-6">
          {/* Profile Card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold">Admin Profile</h3>
              <p className="mt-1 text-sm text-slate-500">
                Manage your administrator account information.
              </p>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-700">
                A
              </div>

              <div className="grid flex-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>
                  <input
                    defaultValue="Admin User"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email Address
                  </label>
                  <input
                    defaultValue="admin@commuto.com"
                    type="email"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* General Settings */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold">General Platform Settings</h3>
              <p className="mt-1 text-sm text-slate-500">
                Configure basic Commuto platform information.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Platform Name
                </label>

                <input
                  value={settings.platformName}
                  onChange={(e) =>
                    handleChange("platformName", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Support Email
                </label>

                <input
                  value={settings.supportEmail}
                  onChange={(e) =>
                    handleChange("supportEmail", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </section>

          {/* Ride & Fare */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold">Ride & Fare Settings</h3>
              <p className="mt-1 text-sm text-slate-500">
                Control fare rules and ride configuration.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Platform Commission (%)
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={settings.commission}
                    onChange={(e) =>
                      handleChange("commission", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <span className="absolute right-4 top-3 text-sm text-slate-400">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Minimum Fare
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    value={settings.minFare}
                    onChange={(e) =>
                      handleChange("minFare", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-8 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Max Passengers
                </label>

                <input
                  type="number"
                  value={settings.maxPassengers}
                  onChange={(e) =>
                    handleChange("maxPassengers", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </section>

          {/* Safety */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold">Safety & Risk Controls</h3>
              <p className="mt-1 text-sm text-slate-500">
                Configure automated safety and fraud detection behaviour.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold">Fraud Risk Threshold</p>
                  <p className="text-sm text-slate-500">
                    Automatically flag accounts above this risk score.
                  </p>
                </div>

                <input
                  type="number"
                  value={settings.riskThreshold}
                  onChange={(e) =>
                    handleChange("riskThreshold", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 sm:w-32"
                />
              </div>

              <ToggleRow
                title="Automatic Driver Verification"
                description="Automatically approve drivers after successful document validation."
                enabled={settings.autoVerification}
                onChange={(value) =>
                  handleChange("autoVerification", value)
                }
              />

              <ToggleRow
                title="Maintenance Mode"
                description="Temporarily restrict platform access while maintenance is active."
                enabled={settings.maintenanceMode}
                onChange={(value) =>
                  handleChange("maintenanceMode", value)
                }
                danger
              />
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold">Admin Notifications</h3>
              <p className="mt-1 text-sm text-slate-500">
                Choose which events should generate admin notifications.
              </p>
            </div>

            <div className="space-y-3">
              <NotificationRow
                title="New Ride Activity"
                description="Receive notifications about important ride activity."
                enabled={notifications.newRide}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    newRide: value,
                  }))
                }
              />

              <NotificationRow
                title="New Complaints"
                description="Get notified when passengers or drivers submit complaints."
                enabled={notifications.complaints}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    complaints: value,
                  }))
                }
              />

              <NotificationRow
                title="Driver Verification"
                description="Receive alerts for new driver verification applications."
                enabled={notifications.verification}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    verification: value,
                  }))
                }
              />

              <NotificationRow
                title="Fraud & Risk Alerts"
                description="Get immediate notifications for high-risk activity."
                enabled={notifications.fraud}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    fraud: value,
                  }))
                }
              />

              <NotificationRow
                title="System Updates"
                description="Receive notifications about platform updates and maintenance."
                enabled={notifications.system}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    system: value,
                  }))
                }
              />
            </div>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold">Security</h3>
              <p className="mt-1 text-sm text-slate-500">
                Manage administrator account security.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <button
                onClick={() => alert("Change password flow coming soon.")}
                className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50"
              >
                <div className="mb-2 text-xl">🔐</div>
                <p className="font-semibold">Change Password</p>
                <p className="mt-1 text-sm text-slate-500">
                  Update your administrator password.
                </p>
              </button>

              <button
                onClick={() => alert("2FA setup flow coming soon.")}
                className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50"
              >
                <div className="mb-2 text-xl">🛡️</div>
                <p className="font-semibold">Two-Factor Authentication</p>
                <p className="mt-1 text-sm text-slate-500">
                  Add an extra layer of protection to your admin account.
                </p>
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="font-bold text-red-700">Danger Zone</h3>
              <p className="mt-1 text-sm text-slate-500">
                Actions in this section can affect the entire platform.
              </p>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-xl bg-red-50 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-slate-900">
                  Reset Platform Settings
                </p>
                <p className="text-sm text-slate-500">
                  Restore demo configuration to default values.
                </p>
              </div>

              <button
                onClick={() => alert("Reset functionality will be connected to backend later.")}
                className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Reset Settings
              </button>
            </div>
          </section>

          {/* Bottom Save */}
          <div className="flex justify-end pb-8">
            <button
              onClick={handleSave}
              className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Save All Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Toggle Component */

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
  danger = false,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  danger?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center">
      <div>
        <p className={`font-semibold ${danger ? "text-red-700" : ""}`}>
          {title}
        </p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <button
        onClick={() => onChange(!enabled)}
        className={`relative h-7 w-12 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-slate-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* Notification Component */

function NotificationRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50">
      <div className="pr-4">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <button
        onClick={() => onChange(!enabled)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-slate-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}