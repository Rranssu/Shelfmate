import React, { useState } from 'react';
import './styles/registerForm.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    libraryName: '',
    libraryType: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [libraryUid, setLibraryUid] = useState(null); // State for Library UID

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libraryName: formData.libraryName,
          libraryType: formData.libraryType,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Registration successful!');
        setLibraryUid(data.library_uid); // Set the UID
        // Optionally, reset form
        setFormData({ libraryName: '', libraryType: '', email: '', password: '' });
      } else {
        setMessage(data.message || 'Registration failed');
        setLibraryUid(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
      setLibraryUid(null);
    }
  };

  return (
    <>
      <h1 className="register-title">Register Your Library</h1>
      <p className="register-description">
        Join Shelf Mate as a library partner. Provide your details to get started with our free book platform.
      </p>
      {message && <p className="message">{message}</p>}
      {libraryUid && (
        <p className="uid-message">Your Library UID: <strong>{libraryUid}</strong></p>
      )}
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
              School Library
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
              Normal Library
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
