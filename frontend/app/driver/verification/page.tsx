"use client";

import { useState } from "react";

type UploadBoxProps = {
  title: string;
  description: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
};

export default function DriverVerificationPage() {
  const [license, setLicense] = useState<File | null>(null);
  const [rc, setRc] = useState<File | null>(null);
  const [identity, setIdentity] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!license || !rc || !identity) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Driver Verification</h1>
            <p className="mt-1 text-sm text-slate-500">
              Verify your identity and vehicle to start accepting rides.
            </p>
          </div>

          <a
            href="/driver/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            ← Driver Dashboard
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Progress */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Verification Progress
              </p>
              <h2 className="mt-1 text-xl font-bold">
                Complete your driver profile
              </h2>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${
                submitted
                  ? "bg-amber-50 text-amber-700"
                  : "bg-indigo-50 text-indigo-700"
              }`}
            >
              {submitted ? "Under Review" : "3 Documents Required"}
            </span>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                submitted ? "w-full bg-amber-500" : "w-1/3 bg-indigo-600"
              }`}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>Personal Details</span>
            <span>Documents</span>
            <span>Review</span>
            <span>Verified</span>
          </div>
        </section>

        {/* Success */}
        {submitted && (
          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl">
                ⏳
              </div>

              <div>
                <h2 className="font-semibold text-amber-900">
                  Verification submitted successfully
                </h2>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Your documents have been submitted for review. You will be
                  able to accept rides once your verification is approved.
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Documents */}
          <section className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div>
              <h2 className="text-xl font-semibold">
                Upload Verification Documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload clear and valid documents. Supported formats: JPG, PNG,
                PDF.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <UploadBox
                title="Driving Licence"
                description="Upload the front and back of your valid driving licence."
                required
                file={license}
                onChange={setLicense}
              />

              <UploadBox
                title="Vehicle Registration Certificate"
                description="Upload your vehicle RC for verification."
                required
                file={rc}
                onChange={setRc}
              />

              <UploadBox
                title="Identity Proof"
                description="Upload a valid government-issued identity document."
                required
                file={identity}
                onChange={setIdentity}
              />
            </div>

            {/* Driver Details */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h2 className="text-lg font-semibold">
                Vehicle Information
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    Vehicle Model
                  </label>

                  <input
                    placeholder="e.g. Hyundai Creta"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Vehicle Number
                  </label>

                  <input
                    placeholder="e.g. RJ14AB1234"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Vehicle Type
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                    <option>Hatchback</option>
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Manufacturing Year
                  </label>

                  <input
                    type="number"
                    placeholder="2024"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                By submitting, you confirm that the information provided is
                accurate.
              </p>

              <button
                onClick={handleSubmit}
                disabled={
                  !license || !rc || !identity || submitted
                }
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitted
                  ? "Submitted for Review"
                  : "Submit for Verification"}
              </button>
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Verification Status */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">
                Verification Status
              </h2>

              <div className="mt-5 space-y-4">
                <StatusItem
                  title="Profile"
                  status="Completed"
                  icon="✓"
                  completed
                />

                <StatusItem
                  title="Identity"
                  status={identity ? "Uploaded" : "Pending"}
                  icon={identity ? "✓" : "2"}
                  completed={!!identity}
                />

                <StatusItem
                  title="Driving Licence"
                  status={license ? "Uploaded" : "Pending"}
                  icon={license ? "✓" : "3"}
                  completed={!!license}
                />

                <StatusItem
                  title="Vehicle RC"
                  status={rc ? "Uploaded" : "Pending"}
                  icon={rc ? "✓" : "4"}
                  completed={!!rc}
                />
              </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
              <div className="flex gap-3">
                <span className="text-xl">🔒</span>

                <div>
                  <h3 className="font-semibold text-indigo-900">
                    Your documents are secure
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-indigo-700">
                    Documents submitted for verification are intended only
                    for identity and vehicle verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Verify */}
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <h2 className="text-lg font-semibold">
                Why get verified?
              </h2>

              <div className="mt-5 space-y-4">
                <Benefit text="Build passenger trust" />
                <Benefit text="Unlock ride requests" />
                <Benefit text="Get a verified badge" />
                <Benefit text="Improve your driver profile" />
              </div>
            </div>
          </aside>
        </div>

        {/* Help */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">
                Having trouble with verification?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Make sure your documents are valid, readable and not expired.
              </p>
            </div>

            <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">
              Contact Support
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}


/* ---------- Upload Box ---------- */

function UploadBox({
  title,
  description,
  required,
  file,
  onChange,
}: UploadBoxProps) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>

            {required && (
              <span className="text-xs font-medium text-red-500">
                Required
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        {file && (
          <span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            ✓ Ready
          </span>
        )}
      </div>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-7 text-center transition hover:border-indigo-300 hover:bg-indigo-50">
        <span className="text-3xl">
          {file ? "📄" : "☁️"}
        </span>

        <span className="mt-3 text-sm font-semibold text-slate-700">
          {file ? file.name : "Click to upload document"}
        </span>

        <span className="mt-1 text-xs text-slate-400">
          PDF, JPG or PNG
        </span>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            onChange(e.target.files?.[0] || null);
          }}
        />
      </label>

      {file && (
        <button
          onClick={() => onChange(null)}
          className="mt-3 text-xs font-semibold text-red-500 hover:underline"
        >
          Remove document
        </button>
      )}
    </div>
  );
}


/* ---------- Status Item ---------- */

function StatusItem({
  title,
  status,
  icon,
  completed,
}: {
  title: string;
  status: string;
  icon: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
          completed
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p
          className={`text-xs ${
            completed ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}


/* ---------- Benefit ---------- */

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm">
        ✓
      </span>

      <span className="text-sm text-slate-300">{text}</span>
    </div>
  );
}