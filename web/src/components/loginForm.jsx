import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './styles/loginForm.css';

function LoginForm({ onSwitchToRegister }) { // Added prop to switch views
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [libraryData, setLibraryData] = useState(null);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Login successful!');
        setLibraryData(data);
        
        // --- UPDATED NAVIGATION ---
        setTimeout(() => {
          navigate('/dashboard', { 
            state: { 
              // We get these from the backend response now
              libraryUid: data.library_uid, 
              libraryName: data.library_name 
            } 
          });
        }, 1000); 
        // --------------------------

        setFormData({ email: '', password: '' });
      } else {
        setMessage(data.message || 'Login failed');
        setLibraryData(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
      setLibraryData(null);
    }
  };

  return (
    <>
      <h1 className="login-title">Login to Your Library</h1>
      <p className="login-description">
        Access your Shelf Mate library dashboard. Enter your credentials to get started.
      </p>
      {message && <p className="message">{message}</p>}
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-btn">Login</button>
      </form>

      {/* Optional: Link to switch to Register */}
      {onSwitchToRegister && (
        <p style={{marginTop: '20px', textAlign: 'center'}}>
          Don't have a library account? <button onClick={onSwitchToRegister} style={{background:'none', border:'none', color:'blue', cursor:'pointer', textDecoration:'underline'}}>Register here</button>
        </p>
      )}
    </>
  );
}

export default LoginForm;