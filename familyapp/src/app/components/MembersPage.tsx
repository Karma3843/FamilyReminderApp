import React, { useState } from "react";

export function Members() {
  const [members, setMembers] = useState([
    { id: 1, name: "Srushti", role: "Admin" },
    { id: 2, name: "Mom", role: "Member" },
    { id: 3, name: "Dad", role: "Member" },
  ]);

  const deleteMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Members</h1>

      {members.map((m) => (
        <div key={m.id} className="flex justify-between p-3 border rounded-xl mb-2">
          <span>{m.name}</span>
          {m.role !== "Admin" && (
            <button onClick={() => deleteMember(m.id)}>❌</button>
          )}
        </div>
      ))}
    </div>
  );
}