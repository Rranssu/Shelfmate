import React, { useState, useEffect } from 'react';
import { FaBookOpen, FaClipboardList, FaClock } from 'react-icons/fa';
import './styles/overview.css';

function Overview({ libraryUid }) {
  const [stats, setStats] = useState({
    booksBorrowedToday: 0,
    entriesToday: 0,
    toBeReturned: 0
  });

  useEffect(() => {
    if (!libraryUid) return;

    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/dashboard/today-stats?libraryUid=${libraryUid}`);
        const data = await response.json();
        
        if (response.ok) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching overview:', error);
      }
    };

    fetchStats();
  }, [libraryUid]);

  return (
    <div className="overview-container">
      <h2>Today's Overview</h2>
      <div className="overview-stats">
        <div className="stat-item">
          <FaBookOpen className="stat-icon" />
          <div>
            <p className="stat-number">{stats.booksBorrowedToday}</p>
            <p className="stat-label">Borrowed Today</p>
          </div>
        </div>
        <div className="stat-item">
          <FaClipboardList className="stat-icon" />
          <div>
            <p className="stat-number">{stats.entriesToday}</p>
            <p className="stat-label">Entries Today</p>
          </div>
        </div>
        <div className="stat-item">
          <FaClock className="stat-icon" />
          <div>
            <p className="stat-number">{stats.toBeReturned}</p>
            <p className="stat-label">To Be Returned</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;