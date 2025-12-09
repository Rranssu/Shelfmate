import React from 'react';
import './styles/recentEntry.css';

function RecentEntry() {
  const entries = [
    { id: 1, student: 'John Doe', book: 'Harry Potter', action: 'Borrowed', time: '10:30 AM' },
    { id: 2, student: 'Jane Smith', book: 'To Kill a Mockingbird', action: 'Returned', time: '11:15 AM' },
    { id: 3, student: 'Bob Johnson', book: '1984', action: 'Borrowed', time: '12:00 PM' }
  ];

  return (
    <div className="recent-entry-container">
      <h2>Recent Entries</h2>
      <div className="entries-list">
        {entries.map(entry => (
          <div key={entry.id} className="entry-item">
            <p><strong>{entry.student}</strong> {entry.action} <em>{entry.book}</em></p>
            <p className="entry-time">{entry.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentEntry;