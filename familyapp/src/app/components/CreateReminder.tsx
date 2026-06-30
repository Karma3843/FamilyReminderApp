import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react";

const familyMembers = ["Mom", "Dad", "Emma", "Jake"];

export function CreateReminder() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [priority, setPriority] = useState("Medium");
  const [repeat, setRepeat] = useState("None");

  const toggleMember = (member: string) => {
    setSelectedMembers((prev) =>
      prev.includes(member)
        ? prev.filter((m) => m !== member)
        : [...prev, member]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 text-gray-600"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <h1 className="text-2xl mb-6">Create Reminder</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-2 text-sm text-gray-700">
            Reminder Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter reminder title"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-2 text-sm text-gray-700">
            <Calendar size={16} className="inline mr-2" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block mb-2 text-sm text-gray-700">
            <Clock size={16} className="inline mr-2" />
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Repeat */}
        <div>
          <label className="block mb-2 text-sm text-gray-700">
            Repeat
          </label>
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
          >
            <option>None</option>
            <option>Daily</option>
            <option>Weekly</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block mb-2 text-sm text-gray-700">
            Priority
          </label>
          <div className="flex gap-3">
            {["Low", "Medium", "High"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setPriority(level)}
                className={`px-4 py-2 rounded-xl border-2 ${
                  priority === level
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "border-gray-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Members */}
        <div>
          <label className="block mb-3 text-sm text-gray-700">
            <Users size={16} className="inline mr-2" />
            Tag Family Members
          </label>
          <div className="grid grid-cols-2 gap-3">
            {familyMembers.map((member) => (
              <button
                key={member}
                type="button"
                onClick={() => toggleMember(member)}
                className={`px-4 py-3 rounded-xl border-2 transition-all ${
                  selectedMembers.includes(member)
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                {member}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Save Reminder
        </button>
      </form>
    </div>
  );
}