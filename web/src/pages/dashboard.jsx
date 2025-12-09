import React, { useState } from 'react';
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
  const [selectedStudentId, setSelectedStudentId] = useState('');

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

  const handleSeeBorrowed = (studentId) => {
    setSelectedStudentId(studentId);
    setCurrentView('returnList');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleBackToReturn = () => {
    setCurrentView('return');
  };

  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : ''}`}>
      <NavbarDashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      {currentView === 'dashboard' && (
        <DashboardUI onLogEntry={handleLogEntry} onBorrow={handleBorrow} onReturn={handleReturn} />
      )}
      {currentView === 'log' && (
        <LogUI onBack={handleBackToDashboard} />
      )}
      {currentView === 'borrow' && (
        <BorrowUI onBack={handleBackToDashboard} />
      )}
      {currentView === 'return' && (
        <ReturnUI onBack={handleBackToDashboard} onSeeBorrowed={handleSeeBorrowed} />
      )}
      {currentView === 'returnList' && (
        <ReturnListUI studentId={selectedStudentId} onBack={handleBackToDashboard} />
      )}
    </div>
  );
}

export default Dashboard;
