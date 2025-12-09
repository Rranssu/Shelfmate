// src/components/entryLogbook.jsx
import React, { useState } from "react";
import "../components/styles/adminSide.css";
// Temporary dummy data
const dummyLogbook = [
  {
    studentId: "student001",
    name: "Alice",
    loginTime: new Date("2025-12-09T08:15:00"),
    logoutTime: new Date("2025-12-09T12:30:00")
  },
  {
    studentId: "student002",
    name: "Bob",
    loginTime: new Date("2025-12-09T09:00:00"),
    logoutTime: new Date("2025-12-09T11:45:00")
  }
];

export default function EntryLogbook() {
  // Initialize state directly with dummy data
  const [logbook] = useState(dummyLogbook);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--crimson)] mb-6">
        Student Entry Logbook
      </h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#aa0022", color: "white" }}>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Student ID</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Name</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Login Time</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Logout Time</th>
          </tr>
        </thead>
        <tbody>
          {logbook.map((entry) => (
            <tr key={entry.studentId}>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{entry.studentId}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{entry.name}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {entry.loginTime.toLocaleString()}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {entry.logoutTime.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}