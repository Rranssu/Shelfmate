import React, { useState } from 'react';
import './styles/returnUI.css';

function ReturnUI({ onBack, onSeeBorrowed }) { 
  const [studentId, setStudentId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentId.trim()) {
      // Pass the ID up to the Dashboard
      onSeeBorrowed(studentId);
    }
  };

  return (
    <section className="return-content">
      <div className="return-container">
        <button className="back-btn" onClick={onBack}>← Dashboard</button>
        <h2 className="return-title">Return Book</h2>
        <p className="return-description">Enter the Student ID to view borrowed books.</p>
        
        <form className="return-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">Student ID Number</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              placeholder="Enter Student ID"
            />
          </div>
          <button type="submit" className="return-btn">
            See Borrowed Books
          </button>
        </form>
      </div>
    </section>
  );
}

export default ReturnUI;