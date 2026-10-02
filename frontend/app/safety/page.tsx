"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  createdAt: string;
}

interface SosAlert {
  id: number;
  userId: number;
  userName: string;
  userPhone: string;
  rideId: number | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  message: string;
  createdAt: string;
  resolvedAt: string | null;
  notifiedContacts?: string[];
}

interface SafetySummary {
  safetyScore: number;
  contactCount: number;
  profileVerified: boolean;
  hasPrimaryContact: boolean;
  hasPreferencesConfigured: boolean;
  contacts: EmergencyContact[];
  activeAlerts: SosAlert[];
}

export default function SafetyCenterPage() {
  const [summary, setSummary] = useState<SafetySummary | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<SosAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [sosOpen, setSosOpen] = useState(false);
  const [sosMessage, setSosMessage] = useState("");
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRelationship, setNewRelationship] = useState("Family");
  const [newIsPrimary, setNewIsPrimary] = useState(false);

  const loadSafetyData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      await Promise.resolve();
      setErrorMessage("Please log in to access your safety center.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(apiUrl("/api/safety/summary"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Unable to fetch safety details.");
      }

      const data = (await res.json()) as SafetySummary;
      setSummary(data);
      setContacts(data.contacts || []);
      setActiveAlerts(data.activeAlerts || []);
      setErrorMessage("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load safety data.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    const init = async () => {
      await Promise.resolve();
      if (isCurrent) {
        await loadSafetyData();
      }
    };
    void init();
    return () => {
      isCurrent = false;
    };
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newRelationship.trim()) {
      setErrorMessage("Please fill all required contact details.");
      return;
    }

    setActionLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/safety/contacts"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
          relationship: newRelationship.trim(),
          isPrimary: newIsPrimary,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add emergency contact.");
      }

      setSuccessMessage("Emergency contact added successfully.");
      setAddModalOpen(false);
      setNewName("");
      setNewPhone("");
      setNewRelationship("Family");
      setNewIsPrimary(false);
      await loadSafetyData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add contact.";
      setErrorMessage(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm("Are you sure you want to remove this emergency contact?")) {
      return;
    }

    setActionLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/api/safety/contacts/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to remove emergency contact.");
      }

      setSuccessMessage("Contact removed.");
      await loadSafetyData();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete contact.";
      setErrorMessage(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTriggerSos = async () => {
    setActionLoading(true);
    setErrorMessage("");

    const sendSos = async (latitude: number | null, longitude: number | null) => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(apiUrl("/api/safety/sos"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude,
            longitude,
            message: sosMessage.trim() || "Emergency SOS triggered from safety center",
          }),
        });

        if (!res.ok) {
          throw new Error("Could not transmit SOS alert. Please seek local emergency services immediately.");
        }

        const data = (await res.json().catch(() => null)) as { notifiedContacts?: string[] } | null;
        const alerted = data?.notifiedContacts || [];
        const contactDetails = alerted.length > 0
          ? ` SMS alerts & live coordinates dispatched to: ${alerted.join(", ")}.`
          : " Support and emergency services notified.";

        setSosOpen(false);
        setSosMessage("");
        setSuccessMessage(`SOS alert activated!${contactDetails}`);
        await loadSafetyData();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "SOS failed to transmit.";
        setErrorMessage(message);
      } finally {
        setActionLoading(false);
      }
    };

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => sendSos(pos.coords.latitude, pos.coords.longitude),
        () => sendSos(null, null),
        { timeout: 8000 }
      );
    } else {
      await sendSos(null, null);
    }
  };

  const handleResolveSos = async (alertId: number) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/api/safety/sos/${alertId}/resolve`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Unable to resolve SOS alert.");
      }

      setSuccessMessage("Emergency alert marked as resolved.");
      await loadSafetyData();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resolve SOS alert.";
      setErrorMessage(message);
    } finally {
      setActionLoading(false);
    }
  };

  const getShareDetails = () => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/rides`
      : "http://localhost:3000/rides";
    const text = `🛡️ I am travelling safely with Commuto. Track my journeys and live ride status here: ${url}`;
    return { url, text };
  };

  const handleCopyLink = () => {
    const { url } = getShareDetails();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    const { url, text } = getShareDetails();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Commuto Journey & Safety Tracking",
          text: text,
          url: url,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    handleCopyLink();
  };

  const handleWhatsAppShare = () => {
    const { text } = getShareDetails();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleSmsShare = () => {
    const { text } = getShareDetails();
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
  };

  const handleShareTrip = () => {
    setShareModalOpen(true);
  };

  const score = summary ? summary.safetyScore : 50;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Commuto<span className="text-blue-600">.</span>
            </Link>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              Safety Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pt-8">
        {/* Alerts & Messages */}
        {errorMessage && (
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="text-xs text-red-600 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700 border border-green-200 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-xs text-green-600 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ACTIVE SOS BANNER */}
        {activeAlerts.length > 0 && (
          <section className="mb-8 rounded-3xl bg-red-600 p-6 text-white shadow-xl ring-4 ring-red-400/30 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl">
                  🚨
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-red-600 uppercase tracking-wide">
                      Active Emergency
                    </span>
                    <span className="text-xs text-red-100">
                      Alert #{activeAlerts[0].id}
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl font-bold">
                    Emergency Alert Active
                  </h2>
                  <p className="mt-1 text-sm text-red-100">
                    &ldquo;{activeAlerts[0].message}&rdquo;
                  </p>
                  {activeAlerts[0].latitude && activeAlerts[0].longitude && (
                    <p className="mt-1 text-xs text-red-200">
                      Location: {activeAlerts[0].latitude.toFixed(4)}, {activeAlerts[0].longitude.toFixed(4)}
                    </p>
                  )}
                  {activeAlerts[0].notifiedContacts && activeAlerts[0].notifiedContacts.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-red-500/40">
                      <span className="text-[11px] font-bold text-red-200 uppercase tracking-wider">SMS Dispatched:</span>
                      {activeAlerts[0].notifiedContacts.map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                          📱 {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleResolveSos(activeAlerts[0].id)}
                  disabled={actionLoading}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-red-600 shadow-md transition hover:bg-red-50 disabled:opacity-50"
                >
                  {actionLoading ? "Resolving..." : "I am Safe · Resolve Alert"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Hero */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-slate-900 px-8 py-9 text-white shadow-xl relative">
          <div className="max-w-3xl relative z-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
              Commuto Safety Center
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">
              Travel with confidence.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
              Manage your emergency contacts, broadcast SOS alerts in real time, and configure safety preferences designed for your journeys.
            </p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-9xl select-none">
            🛡️
          </div>
        </section>

        {/* Safety Score + SOS Grid */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Safety Score Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    YOUR SAFETY RATING
                  </p>
                  <h2 className="mt-1 text-3xl font-bold">
                    {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Attention"}
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                    {score >= 80
                      ? "Your profile has completed the recommended safety steps. You are ready for smart, protected rides."
                      : "Add emergency contacts and verify your account to maximize your trip protection score."}
                  </p>
                </div>

                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-8 border-green-100 bg-green-50 shadow-inner">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {loading ? "..." : score}
                    </p>
                    <p className="text-xs font-semibold text-slate-400">/ 100</p>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <SafetyCheck
                  text="Profile verified"
                  active={summary?.profileVerified ?? true}
                />
                <SafetyCheck
                  text="Emergency contact added"
                  active={summary?.hasPrimaryContact ?? false}
                />
                <SafetyCheck
                  text="Preferences configured"
                  active={summary?.hasPreferencesConfigured ?? true}
                />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{contacts.length} / 5 contacts registered</span>
              <span>Live SOS readiness: Online</span>
            </div>
          </div>

          {/* SOS Trigger Card */}
          <div className="rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 p-7 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm">
                🚨
              </div>

              <h2 className="mt-5 text-2xl font-bold">Emergency SOS</h2>
              <p className="mt-2 text-sm leading-6 text-red-100">
                Trigger immediate alerts with GPS coordinates to Commuto emergency response and your primary contacts.
              </p>
            </div>

            <button
              onClick={() => setSosOpen(true)}
              className="mt-6 w-full rounded-2xl bg-white px-5 py-4 text-sm font-bold text-red-600 shadow-md transition hover:bg-red-50 hover:shadow-lg active:scale-95"
            >
              Activate SOS
            </button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Quick safety actions</h2>
              <p className="mt-1 text-sm text-slate-500">
                Essential tools available before, during, and after your trip.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ActionCard
              icon="📍"
              title="Share Live Trip"
              description="Share trip link with trusted contacts to track your route in real time."
              buttonText={shareLinkCopied ? "Link Copied! ✓" : "Share Trip"}
              onClick={handleShareTrip}
            />

            <ActionCard
              icon="👥"
              title="Add Contact"
              description="Register family or friends who should be reached during alerts."
              buttonText="+ Add Contact"
              onClick={() => setAddModalOpen(true)}
            />

            <ActionCard
              icon="🛡️"
              title="Driver Verification"
              description="Review verification guidelines and background standards."
              buttonText="Learn More"
              onClick={() => alert("All Commuto drivers undergo vehicle registration and identity checks before accepting passengers.")}
            />

            <ActionCard
              icon="📞"
              title="Emergency Helpline"
              description="Direct hotlines: National Emergency (112), Women Helpline (1091)."
              buttonText="Call 112"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "tel:112";
                }
              }}
            />
          </div>
        </section>

        {/* Emergency Contacts Management */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                TRUSTED PEOPLE
              </p>
              <h2 className="mt-1 text-xl font-bold">Emergency contacts</h2>
              <p className="mt-1 text-sm text-slate-500">
                These contacts receive automated SMS/notification broadcasts when you trigger SOS.
              </p>
            </div>

            <button
              onClick={() => setAddModalOpen(true)}
              disabled={contacts.length >= 5}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
            >
              + Add Contact {contacts.length > 0 && `(${contacts.length}/5)`}
            </button>
          </div>

          {contacts.length === 0 && !loading && (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
              <p className="text-3xl">👥</p>
              <p className="mt-3 text-base font-bold text-slate-800">
                No emergency contacts added yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add at least one trusted primary contact to complete your safety setup.
              </p>
              <button
                onClick={() => setAddModalOpen(true)}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                + Add First Contact
              </button>
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                    {contact.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">{contact.name}</p>
                      {contact.isPrimary && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {contact.relationship} · {contact.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    disabled={actionLoading}
                    className="rounded-lg p-2 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-700"
                    title="Remove Contact"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Habits & Privacy Settings */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold">Before your ride</h2>
            <p className="mt-1 text-sm text-slate-500">
              Essential habits to ensure a seamless and secure ride.
            </p>

            <div className="mt-6 space-y-4">
              <ChecklistItem text="Verify your driver's profile and vehicle registration" />
              <ChecklistItem text="Confirm OTP / Trip pass code prior to departure" />
              <ChecklistItem text="Share live tracking with a family member" />
              <ChecklistItem text="Ensure phone battery remains sufficiently charged" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold">Privacy & trip safety</h2>
            <p className="mt-1 text-sm text-slate-500">
              Standard protections enforced on the Commuto platform.
            </p>

            <div className="mt-6 space-y-5">
              <SettingRow
                title="Real-time trip broadcast"
                description="Allows authorized contacts to view live location updates."
                enabled={true}
              />
              <SettingRow
                title="Driver identity verification"
                description="Requires drivers to submit vehicle and license credentials."
                enabled={true}
              />
              <SettingRow
                title="Immediate SOS dispatch"
                description="Transmits GPS coordinates to emergency systems upon activation."
                enabled={true}
              />
            </div>
          </div>
        </section>
      </div>

      {/* SOS Activation Modal */}
      {sosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-5">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl animate-scale-up">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
              🚨
            </div>

            <h2 className="mt-5 text-center text-2xl font-bold text-slate-900">
              Trigger Emergency SOS?
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500">
              This will immediately record your alert, fetch your device GPS coordinates, and notify your emergency contacts.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional distress note:
              </label>
              <textarea
                value={sosMessage}
                onChange={(e) => setSosMessage(e.target.value)}
                placeholder="e.g. Driver stopped in unfamiliar area..."
                rows={2}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="mt-6 grid gap-3">
              <button
                onClick={handleTriggerSos}
                disabled={actionLoading}
                className="rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-red-700 shadow-lg shadow-red-600/30 transition disabled:opacity-50"
              >
                {actionLoading ? "Transmitting Alert..." : "Yes, Activate SOS Now"}
              </button>

              <button
                onClick={() => setSosOpen(false)}
                disabled={actionLoading}
                className="rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-5">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Emergency Contact</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContact} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Mom, Rahul Sharma"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Relationship
                </label>
                <select
                  value={newRelationship}
                  onChange={(e) => setNewRelationship(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPrimaryCheckbox"
                  checked={newIsPrimary}
                  onChange={(e) => setNewIsPrimary(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPrimaryCheckbox" className="text-xs font-semibold text-slate-700">
                  Set as Primary Contact
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : "Save Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Trip Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-5">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold">
                  📤
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Share Live Trip</h3>
                  <p className="text-xs text-slate-500">Keep family and contacts updated</p>
                </div>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              Share your live journey status and safety tracking link directly with your emergency contacts or via messaging apps.
            </p>

            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition"
              >
                <span>💬</span> Share via WhatsApp
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5b5ce2] py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-[#4a4bcf] transition"
              >
                <span>📱</span> Device Share Options
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSmsShare}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  📨 SMS / Text
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  {shareLinkCopied ? "✓ Link Copied!" : "📋 Copy Link"}
                </button>
              </div>
            </div>

            {shareLinkCopied && (
              <p className="mt-3 text-center text-xs font-bold text-emerald-600">
                ✓ Trip tracking link copied to clipboard!
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function SafetyCheck({ text, active }: { text: string; active: boolean }) {
  return (
    <div
      className={`rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2 ${
        active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      <span>{active ? "✓" : "○"}</span>
      <span>{text}</span>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
          {icon}
        </div>
        <h3 className="mt-4 font-bold">{title}</h3>
        <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
      </div>

      <button
        onClick={onClick}
        className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
      >
        {buttonText}
      </button>
    </div>
  );
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm text-green-600">
        ✓
      </div>
      <p className="text-sm font-semibold text-slate-700">{text}</p>
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
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
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