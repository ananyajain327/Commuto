"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

type UploadBoxProps = {
  title: string;
  description: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
};

interface VerificationStatusResponse {
  id: number;
  driverId: number;
  driverName: string;
  driverEmail: string;
  licenseNumber: string;
  vehicleRc: string;
  insuranceNumber: string;
  vehicleModel: string;
  vehicleNumber: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

export default function DriverVerificationPage() {
  const [license, setLicense] = useState<File | null>(null);
  const [rc, setRc] = useState<File | null>(null);
  const [identity, setIdentity] = useState<File | null>(null);

  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleRc, setVehicleRc] = useState("");
  const [insuranceNumber, setInsuranceNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const [existingVerification, setExistingVerification] = useState<VerificationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadVerificationStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      await Promise.resolve();
      setErrorMessage("Please log in with a driver account.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(apiUrl("/api/driver/verification/status"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const data = (await res.json()) as VerificationStatusResponse;
        setExistingVerification(data);
        setLicenseNumber(data.licenseNumber || "");
        setVehicleRc(data.vehicleRc || "");
        setInsuranceNumber(data.insuranceNumber || "");
        setVehicleModel(data.vehicleModel || "");
        setVehicleNumber(data.vehicleNumber || "");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to load verification status.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    const init = async () => {
      await Promise.resolve();
      if (isCurrent) {
        await loadVerificationStatus();
      }
    };
    void init();
    return () => {
      isCurrent = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNumber.trim() || !vehicleRc.trim() || !insuranceNumber.trim() || !vehicleModel.trim() || !vehicleNumber.trim()) {
      setErrorMessage("Please fill all required vehicle and license numbers.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/driver/verification"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          licenseNumber: licenseNumber.trim(),
          vehicleRc: vehicleRc.trim(),
          insuranceNumber: insuranceNumber.trim(),
          vehicleModel: vehicleModel.trim(),
          vehicleNumber: vehicleNumber.trim().toUpperCase(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to submit verification.");
      }

      const data = (await res.json()) as VerificationStatusResponse;
      setExistingVerification(data);
      setSuccessMessage("Documents submitted successfully! Commuto safety team is reviewing your profile.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const status = existingVerification?.status;
  const isApproved = status === "APPROVED";
  const isPending = status === "PENDING";
  const isRejected = status === "REJECTED";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Commuto<span className="text-blue-600">.</span>
            </Link>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              Driver Portal
            </span>
          </div>

          <Link
            href="/driver/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
          >
            ← Driver Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200">
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700 border border-green-200">
            ✓ {successMessage}
          </div>
        )}

        {/* Progress Banner */}
        <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verification Lifecycle
              </p>
              <h2 className="mt-1 text-2xl font-bold">Driver Verification</h2>
              <p className="mt-1 text-sm text-slate-500">
                Verified drivers receive priority matching, trusted badges, and full passenger access.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                isApproved
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : isPending
                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                  : isRejected
                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                  : "bg-indigo-50 text-indigo-700"
              }`}
            >
              {loading
                ? "Checking..."
                : isApproved
                ? "✓ Verified Driver"
                : isPending
                ? "⏳ Under Admin Review"
                : isRejected
                ? "Action Required: Rejected"
                : "Documents Required"}
            </span>
          </div>

          <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isApproved
                  ? "w-full bg-emerald-500"
                  : isPending
                  ? "w-3/4 bg-amber-500"
                  : isRejected
                  ? "w-1/2 bg-red-500"
                  : "w-1/4 bg-indigo-600"
              }`}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs font-semibold text-slate-400">
            <span className={isApproved || isPending ? "text-slate-900" : ""}>Personal Info</span>
            <span className={isApproved || isPending ? "text-slate-900" : ""}>Documents</span>
            <span className={isApproved || isPending ? "text-amber-600" : ""}>Review</span>
            <span className={isApproved ? "text-emerald-600" : ""}>Verified ✓</span>
          </div>
        </section>

        {/* Status Callout */}
        {isApproved && existingVerification && (
          <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm">
            <div className="flex gap-4 items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
                🛡️
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-950">
                  You are a Verified Commuto Driver
                </h3>
                <p className="mt-1 text-sm text-emerald-800 leading-6">
                  Your vehicle ({existingVerification.vehicleModel} · {existingVerification.vehicleNumber}) and driving licence have been verified by the safety operations team.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-emerald-900">
                  <span>License: {existingVerification.licenseNumber}</span>
                  <span>RC: {existingVerification.vehicleRc}</span>
                  <span>Insurance: {existingVerification.insuranceNumber}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {isPending && existingVerification && (
          <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50/70 p-6 shadow-sm">
            <div className="flex gap-4 items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                ⏳
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-950">
                  Application Under Review
                </h3>
                <p className="mt-1 text-sm text-amber-800 leading-6">
                  Your details ({existingVerification.vehicleModel} · {existingVerification.vehicleNumber}) were submitted on {new Date(existingVerification.submittedAt).toLocaleDateString()}. Admin review usually takes less than 24 hours.
                </p>
              </div>
            </div>
          </section>
        )}

        {isRejected && existingVerification && (
          <section className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <div className="flex gap-4 items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-2xl text-red-600">
                ✕
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-950">
                  Verification Application Rejected
                </h3>
                <p className="mt-1 text-sm text-red-800 leading-6">
                  Reason: &ldquo;{existingVerification.rejectionReason}&rdquo;
                </p>
                <p className="mt-2 text-xs font-semibold text-red-700">
                  Please correct the information below and re-submit your application.
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <section className="lg:col-span-2 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <form onSubmit={handleSubmit}>
              <div>
                <h2 className="text-xl font-bold">
                  {isApproved ? "Registered Vehicle & License Details" : "Document & Vehicle Submission"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your official transport and registration details matching your government documents.
                </p>
              </div>

              {/* Vehicle Form Fields */}
              <div className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">
                      Driving Licence Number
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isApproved}
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. DL-1420110012345"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">
                      Vehicle RC Number
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isApproved}
                      value={vehicleRc}
                      onChange={(e) => setVehicleRc(e.target.value)}
                      placeholder="e.g. RC-RJ-14-2022-9988"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isApproved}
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="e.g. Hyundai Creta, Swift"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">
                      License Plate Number
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isApproved}
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. RJ14 AB 1234"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase focus:border-indigo-600 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">
                      Insurance Policy Number
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isApproved}
                      value={insuranceNumber}
                      onChange={(e) => setInsuranceNumber(e.target.value)}
                      placeholder="e.g. POL-99887766"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {!isApproved && (
                <>
                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <h3 className="text-base font-bold">Document Attachments</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Upload photos or scanned copies for rapid admin verification.
                    </p>
                    <div className="mt-4 space-y-4">
                      <UploadBox
                        title="Driving Licence Copy"
                        description="Front side of your valid permanent driving licence."
                        file={license}
                        onChange={setLicense}
                      />
                      <UploadBox
                        title="Vehicle Registration Certificate (RC)"
                        description="Clear copy of vehicle registration card."
                        file={rc}
                        onChange={setRc}
                      />
                      <UploadBox
                        title="Identity Proof"
                        description="Aadhaar, Passport, or Voter ID."
                        file={identity}
                        onChange={setIdentity}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">
                      By submitting, you certify that all vehicle and license records are authentic.
                    </p>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {submitting
                        ? "Submitting Application..."
                        : isPending
                        ? "Update Verification Details"
                        : "Submit for Verification"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 border border-slate-200">
              <h2 className="text-base font-bold">Verification Checklist</h2>

              <div className="mt-5 space-y-4">
                <StatusItem
                  title="Profile Active"
                  status="Completed"
                  icon="✓"
                  completed={true}
                />
                <StatusItem
                  title="Driving Licence"
                  status={licenseNumber ? "Provided" : "Pending"}
                  icon={licenseNumber ? "✓" : "2"}
                  completed={!!licenseNumber}
                />
                <StatusItem
                  title="Vehicle RC & Insurance"
                  status={vehicleRc && insuranceNumber ? "Provided" : "Pending"}
                  icon={vehicleRc && insuranceNumber ? "✓" : "3"}
                  completed={!!(vehicleRc && insuranceNumber)}
                />
                <StatusItem
                  title="Admin Approval"
                  status={isApproved ? "Approved ✓" : isPending ? "In Review" : "Pending"}
                  icon={isApproved ? "✓" : "4"}
                  completed={isApproved}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
              <h2 className="text-base font-bold">Why verify with Commuto?</h2>

              <div className="mt-5 space-y-3.5">
                <Benefit text="Display the official '✓ Verified Driver' badge" />
                <Benefit text="Passenger confidence & higher ride request acceptance" />
                <Benefit text="Direct eligibility for intercity and high-demand routes" />
                <Benefit text="Safety protection and priority customer support" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function UploadBox({
  title,
  description,
  required,
  file,
  onChange,
}: UploadBoxProps) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">{title}</h4>
            {required && <span className="text-xs text-red-500 font-bold">*</span>}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>

        {file && (
          <span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            ✓ Ready
          </span>
        )}
      </div>

      <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 transition hover:border-indigo-400 hover:bg-indigo-50/50">
        <span className="text-xs font-medium text-slate-600 truncate">
          {file ? `Selected: ${file.name}` : "Click to select document (PDF, PNG, JPG)"}
        </span>
        <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200 shrink-0">
          Browse
        </span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}

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
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
          completed
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-900">{title}</p>
        <p
          className={`text-[11px] ${
            completed ? "text-emerald-600 font-semibold" : "text-slate-400"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
        ✓
      </span>
      <span className="text-xs text-slate-300">{text}</span>
    </div>
  );
}