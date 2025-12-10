import React, { useState } from 'react';
import './styles/logUI.css';

function LogUI({ onBack, libraryUid }) {
  const [schoolId, setSchoolId] = useState('');
  const [message, setMessage] = useState('');
  // New state to control if the message is red (error) or green (success)
  const [messageType, setMessageType] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!libraryUid) {
      setMessage('Error: No library UID available. Please log in again.');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/log-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libraryUid: libraryUid,
          studentId: schoolId,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Success: Show green message and clear input
        setMessage(data.message || 'Entry logged successfully!');
        setMessageType('success');
        setSchoolId(''); 
      } else {
        // Error (Student not found): Show red message and KEEP input so they can fix typo
        setMessage(data.message || 'Failed to log entry');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <section className="log-content">
      <div className="log-container">
        <button className="back-btn" onClick={onBack}>← Dashboard</button>
        <h2 className="log-title">Log Entry</h2>
        <p className="log-description">Enter the Student ID to log a new entry.</p>
        
        {message && (
          <p className={`message ${messageType === 'error' ? 'error-msg' : 'success-msg'}`}>
            {message}
          </p>
        )}
        
        <form className="log-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="schoolId">Student ID Number</label>
            <input
              type="text"
              id="schoolId"
              name="schoolId"
              value={schoolId}
              onChange={(e) => {
                setSchoolId(e.target.value);
                setMessage('');
              }}
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