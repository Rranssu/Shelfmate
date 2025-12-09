import React, { useState } from 'react';
import './styles/logUI.css';

function LogUI({ onBack, libraryUid }) {  // libraryUid prop is already included
  const [schoolId, setSchoolId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!libraryUid) {
      setMessage('Error: No library UID available. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/log-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libraryUid: libraryUid,  // Uses libraryUid in the request
          studentId: schoolId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Entry logged successfully!');
        setSchoolId('');  // Reset form
        // Optionally, call onBack() or stay on page
      } else {
        setMessage(data.message || 'Failed to log entry');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="log-content">
      <div className="log-container">
        <button className="back-btn" onClick={onBack}>← Dashboard</button>
        <h2 className="log-title">Log Entry</h2>
        <p className="log-description">Enter the Student ID to log a new entry.</p>
        {message && <p className="message">{message}</p>}
        <form className="log-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="schoolId">Student ID Number</label>
            <input
              type="text"
              id="schoolId"
              name="schoolId"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              required
              placeholder="Enter School ID"
            />
          </div>
          <button type="submit" className="log-btn">Log Entry</button>
        </form>
      </div>
    </section>
  );
}

export default LogUI;
