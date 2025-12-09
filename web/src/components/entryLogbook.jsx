import React, { useState } from "react";
import "./styles/entryLogbook.css";

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
  const [logbook] = useState(dummyLogbook);

  return (
    <div className="entry-logbook-wrapper">
      <div className="entry-logbook-container">
        <h2>Student Entry Logbook</h2>
        <div className="logbook-table-container">
          <table className="logbook-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Login Time</th>
                <th>Logout Time</th>
              </tr>
            </thead>
            <tbody>
              {logbook.map((entry) => (
                <tr key={entry.studentId}>
                  <td>{entry.studentId}</td>
                  <td>{entry.name}</td>
                  <td>{entry.loginTime.toLocaleString()}</td>
                  <td>{entry.logoutTime.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}