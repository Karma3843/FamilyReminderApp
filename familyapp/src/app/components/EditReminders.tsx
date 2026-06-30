import React, { useState } from "react";
import { Calendar, Users } from "lucide-react";

const myReminders = [
  {
    id: 1,
    title: "Soccer Practice",
    date: "Today, 4:00 PM",
    tags: ["Emma", "Dad"],
    priority: "High",
    repeat: "None",
  },
  {
    id: 2,
    title: "Doctor Visit",
    date: "Tomorrow, 9:00 AM",
    tags: ["Mom"],
    priority: "Medium",
    repeat: "Weekly",
  },
];

export function EditReminders() {
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-6">Edit Your Reminders</h1>

      <div className="space-y-3">
        {myReminders.map((r) => (
          <div key={r.id} className="border rounded-xl p-4 bg-white">

            {/* Normal View */}
            <h3 className="font-medium mb-2">{r.title}</h3>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Calendar size={14} />
              {r.date}
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Users size={14} />
              {r.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() =>
                setEditingId(editingId === r.id ? null : r.id)
              }
              className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg mb-3"
            >
               {editingId === r.id ? "Cancel" : "Edit"}
            </button>

            {editingId === r.id && (
              <div className="border-t pt-3 space-y-3">

                {/* Priority */}
                <div>
                  <label className="text-sm text-gray-600">Priority</label>
                  <select className="w-full border rounded-lg px-3 py-2 mt-1">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                {/* Repeat */}
                <div>
                  <label className="text-sm text-gray-600">Repeat</label>
                  <select className="w-full border rounded-lg px-3 py-2 mt-1">
                    <option>None</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>

                {/* Time */}
                <div>
                  <label className="text-sm text-gray-600">Time</label>
                  <input
                    type="time"
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                {/* Save */}
                <button className="w-full bg-green-600 text-white py-2 rounded-lg">
                  Save Changes
                </button>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}