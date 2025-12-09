import React, { useState } from 'react';
import { FaUserCog, FaMoon, FaSun } from 'react-icons/fa';
import AdminLoginModal from './adminLoginModal.jsx';
import './styles/navbarDashboard.css';

function NavbarDashboard({ isDarkMode, toggleDarkMode, onAdminLogin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdminClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLoginSuccess = () => {
    onAdminLogin(); // Navigate to admin page
  };

  return (
    <>
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <button className="admin-btn" onClick={handleAdminClick}>
            <FaUserCog /> Admin
          </button>
        </div>
        <div className="navbar-center">
          <h1 className="school-name">Your School Name</h1>
        </div>
        <div className="navbar-right">
          <button className="dark-mode-btn" onClick={toggleDarkMode}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </nav>
      <AdminLoginModal isOpen={isModalOpen} onClose={handleCloseModal} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}

export default NavbarDashboard;

