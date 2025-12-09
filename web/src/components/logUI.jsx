import React, { useState } from 'react';
import './styles/logUI.css';

function LogUI({ onBack }) {
  const [schoolId, setSchoolId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle log entry logic here (e.g., API call)
    console.log('Log Entry submitted for School ID:', schoolId);
    // Optionally, call onBack to return to dashboard
    onBack();
  };

  return (
    <section className="log-content">
      <div className="log-container">
        <button className="back-btn" onClick={onBack}>← Dashboard</button>
        <h2 className="log-title">Log Entry</h2>
        <p className="log-description">Enter the Student ID to log a new entry.</p>
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

