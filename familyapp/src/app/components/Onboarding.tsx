import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Onboarding() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="p-6 flex flex-col justify-center h-screen max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Welcome 👋</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Email" className="w-full px-4 py-3 border rounded-xl" />
        <input placeholder="Password" className="w-full px-4 py-3 border rounded-xl" />
        <input placeholder="Family Code" className="w-full px-4 py-3 border rounded-xl" />

        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl">
          Continue
        </button>
      </form>

      <p className="text-center my-4">OR</p>

      <button
        onClick={() => navigate("/create-family")}
        className="w-full border py-3 rounded-xl"
      >
        Create New Family
      </button>
    </div>
  );
}