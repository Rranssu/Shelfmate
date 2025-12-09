import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // 1. Import these hooks

import NavbarDashboard from '../components/navbarDashboard.jsx';
import DashboardUI from '../components/dashboardUI.jsx';
import LogUI from '../components/logUI.jsx';
import BorrowUI from '../components/borrowUI.jsx';
import ReturnUI from '../components/returnUI.jsx';
// Removed ReturnListUI import because your ReturnUI handles the list internally based on your previous code
import './styles/dashboard.css';

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // 2. Init Router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // 3. Retrieve the libraryUid passed from RegisterForm
  const { libraryUid } = location.state || {};

  // 4. Security: If no libraryUid, go back to login/register
  useEffect(() => {
    if (!libraryUid) {
      console.warn("No Library UID found. Redirecting...");
      navigate('/');
    }
  }, [libraryUid, navigate]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogEntry = () => {
    setCurrentView('log');
  };

  const handleBorrow = () => {
    setCurrentView('borrow');
  };

  const handleReturn = () => {
    setCurrentView('return');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // If we don't have an ID yet, return null to prevent errors before redirect
  if (!libraryUid) return null;

  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : ''}`}>
      <NavbarDashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      {currentView === 'dashboard' && (
        <DashboardUI 
          onLogEntry={handleLogEntry} 
          onBorrow={handleBorrow} 
          onReturn={handleReturn} 
        />
      )}
      
      {/* 5. PASS THE libraryUid TO ALL CHILD COMPONENTS */}
      
      {currentView === 'log' && (
        <LogUI 
          onBack={handleBackToDashboard} 
          libraryUid={libraryUid} 
        />
      )}
      
      {currentView === 'borrow' && (
        <BorrowUI 
          onBack={handleBackToDashboard} 
          libraryUid={libraryUid} 
        />
      )}
      
      {currentView === 'return' && (
        <ReturnUI 
          onBack={handleBackToDashboard} 
          libraryUid={libraryUid} 
        />
      )}
    </div>
  );
}

export default Dashboard;