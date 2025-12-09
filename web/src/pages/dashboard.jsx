import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NavbarDashboard from '../components/navbarDashboard.jsx';
import DashboardUI from '../components/dashboardUI.jsx';
import LogUI from '../components/logUI.jsx';
import BorrowUI from '../components/borrowUI.jsx';
import ReturnUI from '../components/returnUI.jsx';
import './styles/dashboard.css';

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const location = useLocation();
  const navigate = useNavigate();

  // --- RETRIEVE BOTH UID AND NAME ---
  const { libraryUid, libraryName } = location.state || {}; 

  useEffect(() => {
    if (!libraryUid) {
      navigate('/');
    }
  }, [libraryUid, navigate]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAdminLogin = () => {
    // Pass both items to admin dashboard if needed
    navigate('/admin', { state: { libraryUid, libraryName } });
  };

  // ... (Keep your handleLogEntry, handleBorrow, etc. functions here) ...
  const handleLogEntry = () => setCurrentView('log');
  const handleBorrow = () => setCurrentView('borrow');
  const handleReturn = () => setCurrentView('return');
  const handleBackToDashboard = () => setCurrentView('dashboard');

  if (!libraryUid) return null;

  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : ''}`}>
      {/* --- PASS LIBRARY NAME TO NAVBAR --- */}
      <NavbarDashboard 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        libraryUid={libraryUid} 
        libraryName={libraryName} 
        onAdminLogin={handleAdminLogin} 
      />
      
      {currentView === 'dashboard' && (
        <DashboardUI 
          onLogEntry={handleLogEntry} 
          onBorrow={handleBorrow} 
          onReturn={handleReturn} 
        />
      )}
      
      {currentView === 'log' && (
        <LogUI onBack={handleBackToDashboard} libraryUid={libraryUid} />
      )}
      
      {currentView === 'borrow' && (
        <BorrowUI onBack={handleBackToDashboard} libraryUid={libraryUid} />
      )}
      
      {currentView === 'return' && (
        <ReturnUI onBack={handleBackToDashboard} libraryUid={libraryUid} />
      )}
    </div>
  );
}

export default Dashboard;