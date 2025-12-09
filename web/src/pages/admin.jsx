import React, { useState } from 'react';
import AdminDashboard from '../components/adminDashboard';
import './styles/admin.css';

function Admin() {
  const [currentView, setCurrentView] = useState('dashboard'); // For future navigation

  const handleMenuClick = (view) => {
    setCurrentView(view);
    // Add logic to switch views if more components are added
  };

  return (
    <AdminDashboard />
  );
}

export default Admin;

