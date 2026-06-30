import React from "react";
import { Bell, CheckCircle, Clock } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "upcoming",
    title: "Soccer Practice",
    message: "Mom tagged you in 'Soccer Practice'",
    sub: "Starts at 4:00 PM",
    time: "30 min ago",
    icon: Clock,
  },
  {
    id: 2,
    type: "completed",
    title: "Piano Lesson",
    message: "Emma completed this reminder",
    sub: "Marked as done",
    time: "2 hours ago",
    icon: CheckCircle,
  },
  {
    id: 3,
    type: "new",
    title: "Grocery Shopping",
    message: "Dad created a new reminder",
    sub: "Assigned to you",
    time: "5 hours ago",
    icon: Bell,
  },
  {
    id: 4,
    type: "upcoming",
    title: "Dentist Appointment",
    message: "Reminder scheduled",
    sub: "Tomorrow at 10:30 AM",
    time: "1 day ago",
    icon: Clock,
  },
];

// 🎯 Status-based color logic
const getColor = (type: string) => {
  switch (type) {
    case "completed":
      return "bg-green-50 border-green-200";
    case "new":
      return "bg-purple-50 border-purple-200";
    default:
      return "bg-yellow-50 border-yellow-200";
  }
};

export function Notifications() {
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Notifications</h1>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`${getColor(notification.type)} border-2 rounded-2xl p-4`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Icon size={20} className="text-gray-700" />
                </div>

                <div className="flex-1">
                  <h3 className="mb-1 font-semibold">
                    {notification.title}
                  </h3>

                  <p className="text-sm text-gray-700">
                    {notification.message}
                  </p>

                  <p className="text-sm text-gray-600 mb-1">
                    {notification.sub}
                  </p>

                  <p className="text-xs text-gray-500">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}