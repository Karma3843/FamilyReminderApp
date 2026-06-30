import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, User } from "lucide-react";

const reminders = [
  {
    id: 1,
    title: "Soccer Practice",
    date: "Today, 4:00 PM",
    tags: ["Emma", "Dad"],
  },
  {
    id: 2,
    title: "Dentist Appointment",
    date: "Tomorrow, 10:30 AM",
    tags: ["Mom", "Jake"],
  },
  {
    id: 3,
    title: "Grocery Shopping",
    date: "Friday, 6:00 PM",
    tags: ["Mom", "Dad"],
  },
];

export function Dashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-6 relative">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl">Good Morning, Srushti</h1>
          <p className="text-sm text-gray-500">
            You have {reminders.length} reminders today
          </p>
        </div>

        {/* Profile Icon */}
        <div
          onClick={() => setShowProfile(!showProfile)}
          className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer"
        >
          <User size={18} />
        </div>
      </div>

      {/* 🔥 PROFILE DROPDOWN */}
      {showProfile && (
        <div className="absolute top-16 right-6 bg-white shadow-xl rounded-xl w-72 p-4 z-50">

          {/* Profile Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">
              S
            </div>
            <div>
              <p className="font-semibold">Srushti Deokar</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>

          <hr className="mb-3" />

          {/* ✏️ EDIT REMINDERS (NEW PAGE) */}
          <button
            onClick={() => {
              setShowProfile(false);
              navigate("/dashboard/edit-reminders");
            }}
            className="w-full text-left py-2 px-2 hover:bg-gray-100 rounded-lg"
          >
            ✏️ Edit Reminders
          </button>

          {/* MEMBERS */}
          <button
            onClick={() => {
              setShowProfile(false);
              navigate("/dashboard/members");
            }}
            className="w-full text-left py-2 px-2 hover:bg-gray-100 rounded-lg"
          >
            👥 View Members
          </button>

          {/* SETTINGS */}
          <button className="w-full text-left py-2 px-2 hover:bg-gray-100 rounded-lg">
            ⚙️ Profile Settings
          </button>

          {/* LOGOUT */}
          <button
            onClick={() => navigate("/")}
            className="w-full text-left py-2 px-2 text-red-500 hover:bg-red-50 rounded-lg"
          >
            🚪 Logout
          </button>
        </div>
      )}

      {/* 🔥 REMINDERS LIST (VIEW ONLY NOW) */}
      <div className="space-y-3">
        {reminders.map((r) => (
          <div
            key={r.id}
            className="border rounded-xl p-4 bg-white"
          >
            <h3 className="font-medium mb-2">{r.title}</h3>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Calendar size={14} />
              {r.date}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
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
          </div>
        ))}
      </div>

    </div>
  );
}