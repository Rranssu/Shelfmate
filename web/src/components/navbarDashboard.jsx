import React, { useState } from 'react';
import { FaUserCog, FaMoon, FaSun, FaLock } from 'react-icons/fa';
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
      const response = await fetch('http://localhost:5000/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          libraryUid: libraryUid,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Login successful!');
        setTimeout(() => {
          handleCloseModal();
          onAdminLogin(); 
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
          <div className={`admin-modal-container ${isDarkMode ? 'dark' : ''}`}>
            
            <h2 className="admin-modal-title">Admin Login</h2>
            <p className="admin-modal-description">
              Please enter your password to continue.
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div className="admin-input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Admin Password"
                  className="admin-input"
                  autoFocus
                />
              </div>

              {message && (
                <p className={`admin-message ${message.includes('successful') ? 'success' : 'error'}`}>
                  {message}
                </p>
              )}
              
              <div className="admin-modal-buttons">
                <button type="submit" className="admin-submit-btn" disabled={loading}>
                  {loading ? 'Verifying...' : 'Login'}
                </button>
                <button type="button" className="admin-cancel-btn" onClick={handleCloseModal}>
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