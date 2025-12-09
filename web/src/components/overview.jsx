import React from 'react';
import { FaBookOpen, FaClipboardList, FaClock } from 'react-icons/fa';
import './styles/overview.css';

function Overview() {
  // Mock data
  const stats = {
    booksBorrowed: 45,
    entries: 32,
    toBeReturned: 12
  };

  return (
    <div className="overview-container">
      <h2>Today's Overview</h2>
      <div className="overview-stats">
        <div className="stat-item">
          <FaBookOpen className="stat-icon" />
          <div>
            <p className="stat-number">{stats.booksBorrowed}</p>
            <p className="stat-label">Books Borrowed</p>
          </div>
        </div>
        <div className="stat-item">
          <FaClipboardList className="stat-icon" />
          <div>
            <p className="stat-number">{stats.entries}</p>
            <p className="stat-label">Entries</p>
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