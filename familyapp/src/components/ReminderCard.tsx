import type { Reminder } from "@/services/reminderService";
import { Calendar, Clock, Repeat, Users } from "lucide-react";

interface ReminderCardProps {
  reminder: Reminder;
  onEdit?: (reminder: Reminder) => void;
  onDelete?: (id: number) => void;
}

const priorityConfig = {
  high: {
    border: "border-l-red-500",
    badge: "bg-red-100 text-red-700",
    label: "High",
  },
  medium: {
    border: "border-l-amber-400",
    badge: "bg-amber-100 text-amber-700",
    label: "Medium",
  },
  low: {
    border: "border-l-green-500",
    badge: "bg-green-100 text-green-700",
    label: "Low",
  },
};

const repeatLabels: Record<string, string> = {
  none: "No repeat",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export function ReminderCard({ reminder, onEdit, onDelete }: ReminderCardProps) {
  const config = priorityConfig[reminder.priority as keyof typeof priorityConfig] || priorityConfig.low;

  return (
    <div className={`rounded-xl border border-l-4 bg-white p-5 shadow-sm transition-all hover:shadow-md ${config.border}`}>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{reminder.title}</h3>
          {reminder.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{reminder.description}</p>
          )}
        </div>
        <span className={`ml-3 shrink-0 rounded-full px-3 py-1 text-xs font-medium ${config.badge}`}>
          {config.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-4" />
          {reminder.reminder_date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-4" />
          {reminder.reminder_time}
        </span>
        <span className="flex items-center gap-1.5">
          <Repeat className="size-4" />
          {repeatLabels[reminder.repeat] || reminder.repeat}
        </span>
        {reminder.tagged_users && reminder.tagged_users.length > 0 && (
          <span className="flex items-center gap-1.5">
            <Users className="size-4" />
            {reminder.tagged_users.map((u) => u.name).join(", ")}
          </span>
        )}
      </div>

      {reminder.created_by && (
        <p className="mt-3 text-xs text-gray-400">
          Created by {reminder.created_by.name}
        </p>
      )}

      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2 border-t pt-3">
          {onEdit && (
            <button
              onClick={() => onEdit(reminder)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(reminder.id)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
