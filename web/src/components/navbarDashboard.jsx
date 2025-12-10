import React, { useState } from 'react';
import { FaUserCog, FaMoon, FaSun } from 'react-icons/fa';
import './styles/navbarDashboard.css';

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

  const handleCloseModal = () => setIsModalOpen(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!libraryUid) {
      setMessage('Error: Missing Library ID.');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      // 1. Send the UID and the Input Password to backend
      const response = await fetch('http://localhost:5000/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          libraryUid: libraryUid,
          password: password, // This checks against the password stored in DB from Registration
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Login successful!');
        setTimeout(() => {
          handleCloseModal();
          onAdminLogin(); // Navigate to Admin Dashboard
        }, 1000);
      } else {
        setMessage(data.message || 'Incorrect Password');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Server connection error.');
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
          {/* 2. Display the Dynamic Library Name */}
          <h1 className="school-name">{libraryName || 'My Library'}</h1>
        </div>
        <div className="navbar-right">
          <button className="dark-mode-btn" onClick={toggleDarkMode}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </nav>

      {/* Admin Login Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Admin Login</h2>
            <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>
              Enter the password you created during registration.
            </p>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="password-input"
                />
              </div>
              {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}
              
              <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? 'Checking...' : 'Login'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NavbarDashboard;