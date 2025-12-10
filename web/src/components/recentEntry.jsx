import React, { useState, useEffect } from 'react';
import './styles/recentEntry.css';

function RecentEntry({ libraryUid }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!libraryUid) return;

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/dashboard/recent-transactions?libraryUid=${libraryUid}`);
        const data = await response.json();
        
        if (response.ok) {
          setEntries(data.transactions);
        }
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [libraryUid]);
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="recent-entry-container">
      <h2>Recent Book Activity</h2>
      <div className="entries-list">
        {loading && <p style={{textAlign:'center', color:'#888'}}>Loading...</p>}
        
        {!loading && entries.length === 0 && (
          <p style={{textAlign:'center', color:'#888'}}>No recent activity.</p>
        )}

        {entries.map((entry, index) => (
          <div key={index} className="entry-item">
            <p>
              <strong>{entry.student}</strong>{' '}
              <span className={entry.action === 'Returned' ? 'action-returned' : 'action-borrowed'}>
                {entry.action}
              </span>{' '}
              <em>{entry.book}</em>
            </p>
            <p className="entry-time">{formatTime(entry.time)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentEntry;