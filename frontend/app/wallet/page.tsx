"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface RazorpayConstructor {
  new (options: Record<string, unknown>): { open: () => void };
}

export default function WalletPage() {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [balance, setBalance] = useState(2450);

  // Load Razorpay checkout script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getUserDetails = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        return {
          name: user.fullName || "Commuto User",
          email: user.email || "",
        };
      }
    } catch { /* ignore */ }
    return { name: "Commuto User", email: "" };
  };

  const handleAddMoney = () => {
    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setMessage("Please enter a valid amount.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (numAmount < 10) {
      setMessage("Minimum recharge amount is ₹10.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (typeof window !== "undefined" && window.Razorpay) {
      initiateRazorpayPayment(numAmount);
    } else {
      simulatePayment(numAmount);
    }
  };

  const initiateRazorpayPayment = (numAmount: number) => {
    setPaymentProcessing(true);
    const user = getUserDetails();
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";

    const options = {
      key: razorpayKey,
      amount: numAmount * 100,
      currency: "INR",
      name: "Commuto",
      description: "Wallet Recharge",
      image: "https://your-domain.com/logo.png",
      handler: function () {
        setBalance((prev) => prev + numAmount);
        setShowAddMoney(false);
        setAmount("");
        setMessage(`Successfully added ₹${numAmount} to your wallet!`);
        setPaymentProcessing(false);
        setTimeout(() => setMessage(""), 5000);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: "9876543210",
      },
      theme: {
        color: "#059669",
      },
      modal: {
        ondismiss: function () {
          setPaymentProcessing(false);
        },
      },
    };

    try {
      const RazorpayClass = (window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay;
      if (RazorpayClass) {
        const rzp = new RazorpayClass(options);
        rzp.open();
      } else {
        simulatePayment(numAmount);
      }
    } catch {
      simulatePayment(numAmount);
    }
  };

  const simulatePayment = (numAmount: number) => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setBalance((prev) => prev + numAmount);
      setShowAddMoney(false);
      setAmount("");
      setMessage(`Demo payment successful! Added ₹${numAmount} to your wallet.`);
      setPaymentProcessing(false);
      setTimeout(() => setMessage(""), 5000);
    }, 1500);
  };

  const transactions = [
    {
      title: "Ride to Vaishali Nagar",
      subtitle: "Shared Ride · Honda City",
      amount: "- ₹180",
      date: "Today, 08:15 PM",
      type: "debit",
      icon: "🚗",
    },
    {
      title: "Wallet Recharge (UPI)",
      subtitle: "Added via PhonePe",
      amount: "+ ₹500",
      date: "Yesterday, 02:40 PM",
      type: "credit",
      icon: "⚡",
    },
    {
      title: "Ride to Mansarovar",
      subtitle: "Shared Ride · Maruti Swift",
      amount: "- ₹140",
      date: "12 Sep, 09:30 AM",
      type: "debit",
      icon: "🚗",
    },
    {
      title: "Refund Received",
      subtitle: "Cancelled Ride",
      amount: "+ ₹120",
      date: "07 Sep, 11:30 AM",
      type: "credit",
      icon: "↩️",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Wallet & Payments</h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Manage your Commuto balances and fare splits
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition shadow-2xs"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            ✓ {message}
          </div>
        )}

        {/* Wallet Balance */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl lg:col-span-2 border border-slate-800">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10" />
            <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-emerald-500/5" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Available Balance</p>
                  <h2 className="mt-2 text-4xl font-black">
                    ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-2xl text-emerald-400">
                  💰
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMoney(true)}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition hover:bg-emerald-700 dark:bg-emerald-500 cursor-pointer"
                >
                  + Add Money
                </button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                <span>🔒</span>
                <span>Your payments are protected with 256-bit bank grade encryption.</span>
              </div>
            </div>
          </div>

          {/* Monthly Spending */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Spending</p>
            <h3 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">₹1,280</h3>

            <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full w-[64%] rounded-full bg-emerald-600" />
            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>₹1,280 spent</span>
              <span>₹2,000 budget</span>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">Average per ride</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">₹142</p>
            </div>
          </div>
        </section>

        {/* Transactions */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-6 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transaction History</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Recent wallet activity & ride payments
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg dark:bg-slate-800">
                    {transaction.icon}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{transaction.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {transaction.subtitle}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {transaction.date}
                    </p>
                  </div>
                </div>

                <p
                  className={`font-black text-sm ${
                    transaction.type === "credit"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {transaction.amount}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Money</h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Add funds to your Commuto wallet
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddMoney(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-6">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Amount (INR)</label>
              <div className="mt-1.5 flex items-center rounded-2xl border border-slate-200 px-4 dark:border-slate-700 dark:bg-slate-800">
                <span className="text-base font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-transparent px-3 py-3 text-sm font-semibold outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[200, 500, 1000].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(String(value))}
                  className="rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  ₹{value}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddMoney}
              disabled={paymentProcessing}
              className="mt-6 w-full rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 dark:bg-emerald-500 disabled:opacity-60 transition cursor-pointer shadow-md"
            >
              {paymentProcessing ? "Processing Payment…" : "Continue to Payment"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}