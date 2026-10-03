"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

export default function AdminSettings() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <AdminHeader
          title="Platform Configuration & Settings"
          subtitle="Configure system parameters, fare baselines, commission rates, and safety triggers"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
        />

        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Controls</h2>
            <div className="flex items-center gap-3">
              {saved && (
                <div className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                  ✓ Settings updated successfully
                </div>
              )}
              <button
                onClick={handleSave}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Profile Card */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Admin Profile</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Manage your administrator credentials and support identity.
              </p>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white dark:bg-emerald-600">
                A
              </div>

              <div className="grid flex-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Administrator Name
                  </label>
                  <input
                    defaultValue="Commuto Admin"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    defaultValue="admin@commuto.com"
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Platform Pricing & Commission */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Platform Fare & Commission Controls</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Configure commission rates, minimum ride baseline fares and passenger capacity caps.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Platform Commission (%)
                </label>
                <input
                  type="number"
                  value={settings.commission}
                  onChange={(e) => handleChange("commission", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Minimum Base Fare (₹)
                </label>
                <input
                  type="number"
                  value={settings.minFare}
                  onChange={(e) => handleChange("minFare", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Max Passengers Per Vehicle
                </label>
                <input
                  type="number"
                  value={settings.maxPassengers}
                  onChange={(e) => handleChange("maxPassengers", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* Safety & Notification Toggles */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Admin System Notifications</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Choose alerts that trigger immediate administrator notifications.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { key: "fraud", label: "Emergency SOS panic triggers", desc: "Instant high-priority dispatch notifications" },
                { key: "verification", label: "New driver KYC document submissions", desc: "Alert when a driver submits identity/licence" },
                { key: "complaints", label: "Passenger / Driver dispute tickets", desc: "Notify on critical passenger grievance reports" },
                { key: "newRide", label: "Intercity ride publications", desc: "Summary of new published routes" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={(e) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                    className="h-5 w-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}