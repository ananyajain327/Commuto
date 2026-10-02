export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Notifications</p>
        <h1 className="mt-3 text-3xl font-bold">Your alerts</h1>
        <p className="mt-3 text-slate-600">
          You have no notifications yet. Updates about ride requests, driver confirmations, and trip status will appear here.
        </p>
      </div>
    </main>
  );
}
