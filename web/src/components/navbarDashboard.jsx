import React, { useState } from 'react';
import { FaUserCog, FaMoon, FaSun } from 'react-icons/fa';
import './styles/navbarDashboard.css';

// 1. Added libraryName to props
function NavbarDashboard({ isDarkMode, toggleDarkMode, onAdminLogin, libraryUid, libraryName }) {  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminClick = () => {
    setIsModalOpen(true);
    setMessage('');
    setPassword('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage('');
    setPassword('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!libraryUid) {
      setMessage('Error: No library UID available.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      // This sends the entered password and the libraryUid to the backend
      // The backend must check if this password matches the one created in Registration
      const response = await fetch('http://localhost:5000/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
          libraryUid: libraryUid,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Login successful!');
        setTimeout(() => {
          handleCloseModal();
          onAdminLogin();  // Navigate to /admin
        }, 1000);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
    setLoading(false);
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
          {/* 2. Display the libraryName passed from Registration */}
          <h1 className="school-name">{libraryName || 'My Library'}</h1>
        </div>
        <div className="navbar-right">
          <button className="dark-mode-btn" onClick={toggleDarkMode}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </nav>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Admin Login</h2>
            <p style={{marginBottom: '15px', fontSize: '0.9rem', color: '#666'}}>
              Please enter the password you created during registration.
            </p>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter admin password"
                />
              </div>
              {message && <p className="message">{message}</p>}
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <button type="button" onClick={handleCloseModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NavbarDashboard;