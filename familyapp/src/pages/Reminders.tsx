import { useState, useEffect } from "react";
import { toast } from "sonner";
import { reminderService, type Reminder } from "@/services/reminderService";
import { ReminderCard } from "@/components/ReminderCard";
import { EmptyState } from "@/components/EmptyState";
import { CreateReminderModal } from "@/components/CreateReminderModal";
import { EditReminderModal } from "@/components/EditReminderModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Bell, Plus, Search } from "lucide-react";

const priorities = ["all", "high", "medium", "low"] as const;
const repeats = ["all", "none", "daily", "weekly", "monthly"] as const;

export function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [repeatFilter, setRepeatFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingReminderId, setDeletingReminderId] = useState<number | null>(null);

  const fetchReminders = () => {
    setLoading(true);
    reminderService
      .getAll()
      .then(setReminders)
      .catch(() => setReminders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const sorted = [...reminders].sort((a, b) => b.id - a.id);

  const filtered = sorted.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "all" || r.priority === priorityFilter;
    const matchesRepeat = repeatFilter === "all" || r.repeat === repeatFilter;
    return matchesSearch && matchesPriority && matchesRepeat;
  });

  const handleCreate = async (data: {
    title: string;
    description: string;
    reminder_date: string;
    reminder_time: string;
    repeat: string;
    priority: string;
    family_id: number;
    tagged_users: number[];
  }) => {
    try {
      await reminderService.create(data);
      fetchReminders();
      toast.success("Reminder created successfully");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to create reminder";
      toast.error(msg);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setEditOpen(true);
  };

  const handleEditSubmit = async (data: {
    title: string;
    description: string;
    reminder_date: string;
    reminder_time: string;
    repeat: string;
    priority: string;
    family_id: number;
    tagged_users: number[];
  }) => {
    if (!editingReminder) return;
    try {
      await reminderService.update(editingReminder.id, data);
      setEditingReminder(null);
      fetchReminders();
      toast.success("Reminder updated successfully");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to update reminder";
      toast.error(msg);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingReminderId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingReminderId === null) return;
    try {
      await reminderService.delete(deletingReminderId);
      fetchReminders();
      toast.success("Reminder deleted successfully");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to delete reminder";
      toast.error(msg);
    } finally {
      setDeleteDialogOpen(false);
      setDeletingReminderId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Reminders</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-md"
        >
          <Plus className="size-4" />
          Create Reminder
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reminders..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={repeatFilter}
          onChange={(e) => setRepeatFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">All Repeats</option>
          <option value="none">No Repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={
            search || priorityFilter !== "all" || repeatFilter !== "all"
              ? "No matching reminders"
              : "No reminders yet"
          }
          description={
            search || priorityFilter !== "all" || repeatFilter !== "all"
              ? "Try adjusting your search or filters."
              : "Create your first family reminder to get started."
          }
          action={
            !search && priorityFilter === "all" && repeatFilter === "all" ? (
              <button
                onClick={() => setCreateOpen(true)}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
              >
                Create Reminder
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <CreateReminderModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
      />

      <EditReminderModal
        open={editOpen}
        onOpenChange={setEditOpen}
        reminder={editingReminder}
        onSubmit={handleEditSubmit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reminder? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
