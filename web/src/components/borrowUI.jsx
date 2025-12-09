import React, { useState } from 'react';
import './styles/borrowUI.css';

function BorrowUI({ onBack }) {
  const [studentId, setStudentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Calculate max date (2 months from today)
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 2);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle borrow logic here (e.g., API call to search and borrow)
    console.log('Borrow search submitted for Student ID:', studentId, ', Book/Author:', searchQuery, ', Due Date:', dueDate);
    // Optionally, call onBack to return to dashboard
    onBack();
  };

  return (
    <section className="borrow-content">
      <div className="borrow-container">
        <button className="back-btn" onClick={onBack}>← Dashboard</button>
        <h2 className="borrow-title">Borrow Book</h2>
        <p className="borrow-description">Enter the Student ID, search for a book by title or author, and select a due date (max 2 months).</p>
        <form className="borrow-form" onSubmit={handleSubmit}>
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
          <div className="form-group">
            <label htmlFor="searchQuery">Book Title or Author</label>
            <input
              type="text"
              id="searchQuery"
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
              placeholder="Enter Book Title or Author"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Desired Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today.toISOString().split('T')[0]}
              max={maxDateString}
              required
            />
          </div>
          <button type="submit" className="borrow-btn">Search and Borrow</button>
        </form>
      </div>
    </section>
  );
}

export default BorrowUI;

