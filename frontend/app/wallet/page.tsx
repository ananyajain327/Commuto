"use client";

import { useState } from "react";

export default function WalletPage() {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const transactions = [
    {
      title: "Ride Fare Payment",
      subtitle: "Jaipur → Ajmer",
      amount: "- ₹180",
      date: "Today, 10:42 AM",
      type: "debit",
      icon: "🚕",
    },
    {
      title: "Wallet Recharge",
      subtitle: "UPI •••• 4582",
      amount: "+ ₹500",
      date: "Yesterday, 6:20 PM",
      type: "credit",
      icon: "💳",
    },
    {
      title: "Ride Fare Payment",
      subtitle: "Malviya Nagar → C-Scheme",
      amount: "- ₹95",
      date: "08 Sep, 4:15 PM",
      type: "debit",
      icon: "🚕",
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

  const handleAddMoney = () => {
    if (!amount || Number(amount) <= 0) return;

    setMessage(`₹${amount} added successfully to your wallet.`);
    setAmount("");
    setShowAddMoney(false);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Wallet</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your Commuto payments and fare splits
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

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Success Message */}
        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            ✓ {message}
          </div>
        )}

        {/* Wallet Balance */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-7 text-white shadow-xl lg:col-span-2">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Available Balance</p>
                  <h2 className="mt-3 text-4xl font-bold">₹2,450.00</h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                  💰
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowAddMoney(true)}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  + Add Money
                </button>

                <button className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15">
                  Send Money
                </button>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs text-slate-300">
                <span>🔒</span>
                <span>Your payments are protected with secure encryption.</span>
              </div>
            </div>
          </div>

          {/* Monthly Spending */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">September Spending</p>

            <h3 className="mt-3 text-3xl font-bold">₹1,280</h3>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[64%] rounded-full bg-slate-900" />
            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>₹1,280 spent</span>
              <span>₹2,000 budget</span>
            </div>

            <div className="mt-7 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Average per ride</p>
              <p className="mt-1 text-lg font-bold">₹142</p>
            </div>
          </div>
        </section>

        {/* Fare Split */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold">Latest Fare Split</h2>
              <p className="mt-1 text-sm text-slate-500">
                See how your last shared ride fare was divided.
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
              ✓ Completed
            </span>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {/* Route */}
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Journey
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-slate-900" />
                  <div className="h-12 border-l border-dashed border-slate-300" />
                  <div className="h-3 w-3 rounded-full border-2 border-slate-900 bg-white" />
                </div>

                <div className="space-y-7">
                  <div>
                    <p className="font-semibold">Jaipur</p>
                    <p className="text-xs text-slate-500">6:30 PM</p>
                  </div>

                  <div>
                    <p className="font-semibold">Ajmer</p>
                    <p className="text-xs text-slate-500">8:15 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Split */}
            <div className="rounded-2xl border border-slate-100 p-5">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Total Ride Fare</span>
                <span className="font-semibold">₹540</span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-sm text-slate-500">Passengers</span>
                <span className="font-semibold">3</span>
              </div>

              <div className="my-5 border-t border-dashed" />

              <div className="flex justify-between">
                <span className="font-semibold">Your Share</span>
                <span className="text-xl font-bold">₹180</span>
              </div>

              <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                🎉 You saved approximately ₹160 compared to travelling alone.
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold">Payment Methods</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your saved payment options
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  📱
                </div>

                <div>
                  <p className="font-semibold">UPI</p>
                  <p className="text-xs text-slate-500">ananya@upi</p>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-600">
                Default
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                💳
              </div>

              <div>
                <p className="font-semibold">Debit Card</p>
                <p className="text-xs text-slate-500">•••• 4582</p>
              </div>
            </div>

            <button className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-left hover:bg-slate-50">
              <p className="font-semibold">+ Add Payment Method</p>
              <p className="mt-1 text-xs text-slate-500">
                Add UPI, card or other methods
              </p>
            </button>
          </div>
        </section>

        {/* Transactions */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Transaction History</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Recent wallet activity
                </p>
              </div>

              <button className="text-sm font-semibold text-slate-700 hover:underline">
                View All
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                    {transaction.icon}
                  </div>

                  <div>
                    <p className="font-semibold">{transaction.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {transaction.subtitle}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {transaction.date}
                    </p>
                  </div>
                </div>

                <p
                  className={`font-bold ${
                    transaction.type === "credit"
                      ? "text-emerald-600"
                      : "text-slate-900"
                  }`}
                >
                  {transaction.amount}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
              🔐
            </div>

            <div>
              <h3 className="font-bold">Your money is secure</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Commuto uses secure payment processing and encrypted
                transactions. Your financial information is never shared
                publicly with other riders or drivers.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Add Money</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add funds to your Commuto wallet
                </p>
              </div>

              <button
                onClick={() => setShowAddMoney(false)}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="mt-7">
              <label className="text-sm font-semibold">Amount</label>

              <div className="mt-2 flex items-center rounded-2xl border border-slate-200 px-4 focus-within:border-slate-900">
                <span className="text-lg font-semibold">₹</span>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[500, 1000, 2000].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(String(value))}
                  className="rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  ₹{value}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddMoney}
              className="mt-7 w-full rounded-2xl bg-slate-900 py-4 font-semibold text-white hover:bg-slate-800"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}
    </main>
  );
}