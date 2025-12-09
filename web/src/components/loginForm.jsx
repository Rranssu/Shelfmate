import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import './styles/loginForm.css';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [libraryData, setLibraryData] = useState(null);
  const navigate = useNavigate(); // Add this hook

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
        // Navigate to dashboard with libraryUid
        setTimeout(() => {
          navigate('/dashboard', { state: { libraryUid: data.library_uid } });
        }, 1000); // Optional delay for user to see the message
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
      {libraryData && (
        <div className="login-success">
          <p>Welcome, <strong>{libraryData.library_name}</strong>!</p>
          <p>Library Type: {libraryData.library_type}</p>
          <p>UID: {libraryData.library_uid}</p>
        </div>
      )}
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
    </>
  );
}

export default LoginForm;
