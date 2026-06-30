import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { reminderService, type Reminder } from "@/services/reminderService";
import { familyService, type Family } from "@/services/familyService";
import { StatsCard } from "@/components/StatsCard";
import { ReminderCard } from "@/components/ReminderCard";
import { EmptyState } from "@/components/EmptyState";
import { Bell, AlertTriangle, Users, Calendar, Plus, CheckCircle2, Clock } from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSent, setShowSent] = useState(false);

  useEffect(() => {
    Promise.all([
      reminderService.getAll().catch(() => [] as Reminder[]),
      familyService.getFamilies().catch(() => [] as Family[]),
    ]).then(([r, f]) => {
      setReminders(r);
      setFamilies(f);
    }).finally(() => setLoading(false));
  }, []);

  const pendingReminders = reminders
    .filter((r) => !r.is_sent)
    .sort((a, b) => b.id - a.id);

  const sentReminders = reminders
    .filter((r) => r.is_sent)
    .sort((a, b) => b.id - a.id);

  const highPriorityCount = pendingReminders.filter((r) => r.priority === "high").length;
  const memberCount = families.reduce((sum, f) => sum + (f.members?.length || 0), 0);
  const pendingToday = pendingReminders.filter((r) => r.reminder_date >= new Date().toISOString().split("T")[0]).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (families.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
          <Users className="size-16 text-indigo-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Welcome, {user?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="mb-8 max-w-md text-gray-500">
          You are currently not added to any family. Once a family admin adds you,
          you'll see your family's reminders and members here.
        </p>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/members")}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
          >
            Create Your Own Family
          </button>
          <p className="text-xs text-gray-400">
            You'll become the admin of the family you create
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 p-6 text-white shadow-lg lg:p-8">
        <h1 className="text-2xl font-bold lg:text-3xl">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="mt-2 text-indigo-100">
          You have {pendingReminders.length} pending reminder{pendingReminders.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Clock}
          label="Pending Reminders"
          value={pendingReminders.length}
          gradient="bg-gradient-to-br from-indigo-500 to-blue-600"
        />
        <StatsCard
          icon={Calendar}
          label="Due Today/Upcoming"
          value={pendingToday}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatsCard
          icon={AlertTriangle}
          label="High Priority"
          value={highPriorityCount}
          gradient="bg-gradient-to-br from-red-500 to-rose-600"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Completed"
          value={sentReminders.length}
          gradient="bg-gradient-to-br from-gray-500 to-gray-600"
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Pending Reminders</h2>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
              {pendingReminders.length}
            </span>
          </div>
          <button
            onClick={() => navigate("/dashboard/reminders")}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
          >
            <Plus className="size-4" />
            New Reminder
          </button>
        </div>

        {pendingReminders.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="You're all caught up"
            description="No pending reminders. Create one to keep your family organized."
            action={
              <button
                onClick={() => navigate("/dashboard/reminders")}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
              >
                Create Reminder
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {pendingReminders.slice(0, 5).map((r) => (
              <ReminderCard key={r.id} reminder={r} />
            ))}
            {pendingReminders.length > 5 && (
              <button
                onClick={() => navigate("/dashboard/reminders")}
                className="w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-indigo-300 hover:text-indigo-600"
              >
                View all {pendingReminders.length} pending reminders
              </button>
            )}
          </div>
        )}
      </div>

      {sentReminders.length > 0 && (
        <div>
          <button
            onClick={() => setShowSent(!showSent)}
            className="flex w-full items-center justify-between rounded-xl border bg-white px-5 py-3 text-left transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Sent Reminders</h2>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {sentReminders.length}
              </span>
            </div>
            <svg
              className={`size-5 text-gray-400 transition-transform ${showSent ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showSent && (
            <div className="mt-4 space-y-4">
              {sentReminders.slice(0, 5).map((r) => (
                <ReminderCard key={r.id} reminder={r} />
              ))}
              {sentReminders.length > 5 && (
                <button
                  onClick={() => navigate("/dashboard/reminders")}
                  className="w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400"
                >
                  View all {sentReminders.length} sent reminders
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
