import React, { useState, useEffect } from "react";
import "./styles/entryLogbook.css";

export default function EntryLogbook({ libraryUid }) {
  const [logbook, setLogbook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!libraryUid) return;
    fetchLogs();
  }, [libraryUid]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/logs?libraryUid=${libraryUid}`);
      const data = await response.json();
      if (response.ok) {
        setLogbook(data.logs);
      } else {
        setMessage(data.message || 'Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
    setLoading(false);
  };

  if (loading) return <p>Loading logs...</p>;

  return (
    <div className="entry-logbook-wrapper">
      <div className="entry-logbook-container">
        <h2>Student Entry Logbook</h2>
        {message && <p className="message">{message}</p>}
        <div className="logbook-table-container">
          <table className="logbook-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Login Time</th>
              </tr>
            </thead>
            <tbody>
              {logbook.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.student_id}</td>
                  <td>{entry.name || 'Unknown'}</td>
                  <td>{new Date(entry.logged_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
