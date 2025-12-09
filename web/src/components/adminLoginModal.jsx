import React, { useState } from 'react';
import './styles/adminLoginModal.css';

function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [passkey, setPasskey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple mock validation (replace with real logic)
    if (passkey === 'admin123') { // Example passkey
      console.log('Admin login successful');
      onLoginSuccess(); // Call success handler to navigate to admin page
    } else {
      alert('Invalid passkey');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">Admin Login</h2>
        <p className="modal-description">Enter the admin passkey to access administrative features.</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="passkey">Passkey</label>
            <input
              type="password"
              id="passkey"
              name="passkey"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              required
              placeholder="Enter Admin Passkey"
            />
          </div>
          <button type="submit" className="modal-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginModal;

