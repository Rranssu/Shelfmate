import React from 'react';
import AdminOverview from './adminOverview.jsx';
import AdminLogSummary from './adminLogSummary.jsx';
import AdminDueSummary from './adminDueSummary.jsx';
import './styles/adminDashboard.css';

function AdminDashboard() {
  return (
    <main className="admin-dashboard">
      <div className="dashboard-content">
        <div className="dashboard-vertical">
          <AdminOverview />
          <AdminLogSummary />
          <AdminDueSummary />
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;
