import React, { useState } from 'react';
import './styles/borrowUI.css';

function BorrowUI({ onBack, libraryUid }) { 
  const [studentId, setStudentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 2);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!libraryUid) {
      setMessage('Error: No library UID available. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/borrow-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libraryUid: libraryUid,
          studentId: studentId,
          searchQuery: searchQuery,
          dueDate: dueDate,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        // Reset form
        setStudentId('');
        setSearchQuery('');
        setDueDate('');
      } else {
        setMessage(data.message || 'Failed to borrow book');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="borrow-content">
      <div className="borrow-container">
        <button className="back-btn" onClick={onBack}>← Dashboard</button>
        <h2 className="borrow-title">Borrow Book</h2>
        <p className="borrow-description">Enter the Student ID, search for a book by title or author, and select a due date (max 2 months).</p>
        {message && <p className="message">{message}</p>}
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