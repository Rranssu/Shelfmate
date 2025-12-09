import React, { useState } from 'react';
import AdminSidebar from '../components/adminSidebar.jsx';
import AdminDashboard from '../components/adminDashboard.jsx';
import './styles/admin.css';

function Admin() {
  const [currentView, setCurrentView] = useState('dashboard'); // For future navigation

  const handleMenuClick = (view) => {
    setCurrentView(view);
    // Add logic to switch views if more components are added
  };

  return (
    <div className="admin">
      <AdminSidebar onMenuClick={handleMenuClick} />
      <AdminDashboard />
    </div>
  );
}

export default Admin;

