import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NavbarDashboard from '../components/navbarDashboard.jsx';
import DashboardUI from '../components/dashboardUI.jsx';
import LogUI from '../components/logUI.jsx';
import BorrowUI from '../components/borrowUI.jsx';
import ReturnUI from '../components/returnUI.jsx';
import ReturnListUI from '../components/returnListUI.jsx';
import './styles/dashboard.css';

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [selectedStudentId, setSelectedStudentId] = useState(null); 
  
  const location = useLocation();
  const navigate = useNavigate();

  const { libraryUid, libraryName } = location.state || {}; 

  useEffect(() => {
    if (!libraryUid) {
      navigate('/');
    }
  }, [libraryUid, navigate]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleAdminLogin = () => {
    navigate('/admin', { state: { libraryUid, libraryName } });
  };
  
  const handleLogEntry = () => setCurrentView('log');
  const handleBorrow = () => setCurrentView('borrow');
  
  const handleReturn = () => {
    setCurrentView('return');
    setSelectedStudentId(null); 
  };

  const handleSeeBorrowed = (studentId) => {
    setSelectedStudentId(studentId);
    setCurrentView('returnList');
  };

  const handleBackToDashboard = () => setCurrentView('dashboard');
  

  const handleBackToReturnSearch = () => setCurrentView('return');

  if (!libraryUid) return null;

  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : ''}`}>
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
      
      {/* 1. The Search Form */}
      {currentView === 'return' && (
        <ReturnUI 
          onBack={handleBackToDashboard} 
          onSeeBorrowed={handleSeeBorrowed} 
        />
      )}

      {currentView === 'returnList' && (
        <ReturnListUI 
          onBack={handleBackToReturnSearch} 
          studentId={selectedStudentId}     
          libraryUid={libraryUid}           
        />
      )}
    </div>
  );
}

export default Dashboard;