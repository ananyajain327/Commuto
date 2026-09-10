"use client";

import { useState } from "react";

export default function SafetyCenterPage() {
  const [sosOpen, setSosOpen] = useState(false);
  const [sharing, setSharing] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-bold tracking-tight">
              Commuto<span className="text-blue-600">.</span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Your safety, our priority
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-slate-900 px-8 py-9 text-white shadow-xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
              Commuto Safety Center
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Travel with confidence.
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
              Manage your emergency contacts, share your trip and access
              safety tools whenever you need them.
            </p>
          </div>
        </section>

        {/* Safety Score + SOS */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Safety Score */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  YOUR SAFETY SCORE
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Excellent
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Your profile has completed the recommended safety
                  setup. Keep your emergency information updated.
                </p>
              </div>

              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-8 border-green-100 bg-green-50">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    92
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    / 100
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <SafetyCheck text="Profile verified" />
              <SafetyCheck text="Emergency contact added" />
              <SafetyCheck text="Safety preferences enabled" />
            </div>
          </div>

          {/* SOS */}
          <div className="rounded-3xl bg-red-600 p-7 text-white shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
              🚨
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Emergency SOS
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-100">
              Use SOS if you feel unsafe during your journey.
            </p>

            <button
              onClick={() => setSosOpen(true)}
              className="mt-6 w-full rounded-xl bg-white px-5 py-4 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              Activate SOS
            </button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold">
              Quick safety actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Important tools available during your ride.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ActionCard
              icon="📍"
              title="Share Live Trip"
              description="Share your current journey with trusted contacts."
              buttonText={sharing ? "Trip Shared ✓" : "Share Trip"}
              onClick={() => setSharing(!sharing)}
            />

            <ActionCard
              icon="👥"
              title="Emergency Contacts"
              description="Manage people who should be contacted in an emergency."
              buttonText="Manage Contacts"
            />

            <ActionCard
              icon="🪪"
              title="Driver Verification"
              description="Check your driver's verification and ride credentials."
              buttonText="View Verification"
            />

            <ActionCard
              icon="📞"
              title="Emergency Help"
              description="Quick access to emergency assistance."
              buttonText="Get Help"
            />
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                TRUSTED PEOPLE
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Emergency contacts
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                These contacts can be notified during an emergency.
              </p>
            </div>

            <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600">
              + Add Contact
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ContactCard
              initials="MJ"
              name="Mom"
              relation="Primary contact"
              phone="+91 ••••• 45678"
            />

            <ContactCard
              initials="AJ"
              name="Aman Jain"
              relation="Secondary contact"
              phone="+91 ••••• 98231"
            />
          </div>
        </section>

        {/* Safety Checklist */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold">
              Before your ride
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A few simple habits can make your journey safer.
            </p>

            <div className="mt-6 space-y-4">
              <ChecklistItem text="Verify your driver's profile" />
              <ChecklistItem text="Confirm vehicle registration number" />
              <ChecklistItem text="Share your trip with a trusted contact" />
              <ChecklistItem text="Keep your phone charged" />
            </div>
          </div>

          {/* Privacy */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold">
              Privacy & safety settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Control how your safety information is used.
            </p>

            <div className="mt-6 space-y-5">
              <SettingRow
                title="Share trip progress"
                description="Allow trusted contacts to see your journey."
                enabled={true}
              />

              <SettingRow
                title="Show verified badge"
                description="Display your verification status to other users."
                enabled={true}
              />

              <SettingRow
                title="Emergency notifications"
                description="Receive important safety notifications."
                enabled={true}
              />
            </div>
          </div>
        </section>

        {/* Report */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Something went wrong?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Report a safety concern or suspicious activity to
                Commuto support.
              </p>
            </div>

            <button className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50">
              Report a Safety Issue
            </button>
          </div>
        </section>
      </div>

      {/* SOS Modal */}
      {sosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
              🚨
            </div>

            <h2 className="mt-5 text-center text-2xl font-bold">
              Activate Emergency SOS?
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500">
              This will initiate the emergency assistance flow and
              notify your configured emergency contacts.
            </p>

            <div className="mt-6 grid gap-3">
              <button
                onClick={() => setSosOpen(false)}
                className="rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-red-700"
              >
                Yes, Activate SOS
              </button>

              <button
                onClick={() => setSosOpen(false)}
                className="rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              Demo interface — emergency services are not actually
              contacted yet.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function SafetyCheck({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-green-50 px-4 py-3 text-xs font-semibold text-green-700">
      ✓ {text}
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">{title}</h3>

      <p className="mt-2 min-h-[48px] text-xs leading-5 text-slate-500">
        {description}
      </p>

      <button
        onClick={onClick}
        className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
      >
        {buttonText}
      </button>
    </div>
  );
}

function ContactCard({
  initials,
  name,
  relation,
  phone,
}: {
  initials: string;
  name: string;
  relation: string;
  phone: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
          {initials}
        </div>

        <div>
          <p className="font-bold">{name}</p>
          <p className="mt-1 text-xs text-slate-500">
            {relation} · {phone}
          </p>
        </div>
      </div>

      <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
        Edit
      </button>
    </div>
  );
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-sm text-green-600">
        ✓
      </div>

      <p className="text-sm font-semibold text-slate-700">
        {text}
      </p>
    </div>
  );
}

function SettingRow({
  title,
  description,
  enabled,
}: {
  title: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <div
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 ${
          enabled ? "bg-blue-600 justify-end" : "bg-slate-300"
        }`}
      >
        <div className="h-4 w-4 rounded-full bg-white" />
      </div>
    </div>
  );
}