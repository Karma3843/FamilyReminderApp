import React from "react";
import { useNavigate } from "react-router-dom";

export function CreateFamily() {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex flex-col h-screen max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Create Family</h1>

      <div className="bg-gray-100 p-4 rounded-xl text-center mb-4">
        <p>Family Code</p>
        <h2 className="font-bold">FAM123</h2>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="bg-indigo-600 text-white py-3 rounded-xl"
      >
        Continue
      </button>
    </div>
  );
}