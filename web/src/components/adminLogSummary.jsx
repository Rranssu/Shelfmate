import React from 'react';
import './styles/adminLogSummary.css';

function AdminLogSummary() {
  const recentEntries = [
    { id: 1, student: 'John Doe', book: 'Harry Potter', action: 'Borrowed', time: '10:30 AM' },
    { id: 2, student: 'Jane Smith', book: 'To Kill a Mockingbird', action: 'Returned', time: '11:15 AM' },
    { id: 3, student: 'Bob Johnson', book: '1984', action: 'Borrowed', time: '12:00 PM' },
    { id: 4, student: 'Alice Brown', book: 'Pride and Prejudice', action: 'Borrowed', time: '1:45 PM' },
    { id: 5, student: 'Charlie Wilson', book: 'The Great Gatsby', action: 'Returned', time: '2:30 PM' }
  ];

  return (
    <div className="entries-container">
      <h2>Recent Logged Entries</h2>
      <div className="entries-list">
        {recentEntries.map((entry) => (
          <div key={entry.id} className="entry-item">
            <div className="entry-details">
              <p><strong>{entry.student}</strong> {entry.action} <em>{entry.book}</em></p>
              <p className="entry-time">{entry.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminLogSummary;

