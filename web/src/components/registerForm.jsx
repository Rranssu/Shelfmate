import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/registerForm.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    libraryName: '',
    libraryType: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Registration successful!');
        
        // --- NAVIGATION LOGIC ---
        setTimeout(() => {
          navigate('/dashboard', { 
            state: { 
              libraryUid: data.library_uid, 
              libraryName: formData.libraryName // We use the form input name here
            } 
          });
        }, 1000); 
        // ------------------------

        setFormData({ libraryName: '', libraryType: '', email: '', password: '' });
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <>
      <h1 className="register-title">Register Your Library</h1>
      <p className="register-description">
        Join Shelf Mate as a library partner.
      </p>
      {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}
      
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="libraryName">Library Name</label>
          <input
            type="text"
            id="libraryName"
            name="libraryName"
            value={formData.libraryName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Library Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="libraryType"
                value="school"
                checked={formData.libraryType === 'school'}
                onChange={handleChange}
                required
              />
              School
            </label>
            <label>
              <input
                type="radio"
                name="libraryType"
                value="normal"
                checked={formData.libraryType === 'normal'}
                onChange={handleChange}
                required
              />
              Normal
            </label>
          </div>
        </div>
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
        <button type="submit" className="register-btn">Register Library</button>
      </form>
    </>
  );
}

export default RegisterForm;