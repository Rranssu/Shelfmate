import React from 'react';
import { FaClipboardList, FaBookOpen, FaUndo } from 'react-icons/fa';
import './styles/dashboardUI.css';

function DashboardUI({ onLogEntry, onBorrow, onReturn }) {
  return (
    <section className="dashboard-content">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Library Dashboard</h2>
        <p className="dashboard-description">Manage your library operations with ease.</p>
        <div className="dashboard-buttons">
          <button className="dashboard-btn" onClick={onLogEntry}>
            <FaClipboardList className="btn-icon" />
            Log Entry
          </button>
          <button className="dashboard-btn" onClick={onBorrow}>
            <FaBookOpen className="btn-icon" />
            Borrow
          </button>
          <button className="dashboard-btn" onClick={onReturn}>
            <FaUndo className="btn-icon" />
            Return
          </button>
        </div>
      </div>
    </section>
  );
}

export default DashboardUI;

