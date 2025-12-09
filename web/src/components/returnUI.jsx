import React, { useState } from 'react';
import './styles/returnUI.css';

function ReturnUI({ onBack, libraryUid }) {  // Added libraryUid prop, removed onSeeBorrowed
  const [studentId, setStudentId] = useState('');
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!libraryUid) {
      setMessage('Error: No library UID available. Please log in again.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`http://localhost:5000/api/borrowed-books?libraryUid=${libraryUid}&studentId=${studentId}`);
      const data = await response.json();
      if (response.ok) {
        setBorrowedBooks(data.borrowedBooks);
        if (data.borrowedBooks.length === 0) {
          setMessage('No borrowed books found for this student.');
        }
      } else {
        setMessage(data.message || 'Failed to fetch borrowed books');
        setBorrowedBooks([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
      setBorrowedBooks([]);
    }
    setLoading(false);
  };

  const handleReturn = async (borrowId) => {
    try {
      const response = await fetch('http://localhost:5000/api/return-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ borrowId }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        // Remove the returned book from the list
        setBorrowedBooks(borrowedBooks.filter(book => book.borrow_id !== borrowId));
      } else {
        setMessage(data.message || 'Failed to return book');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="return-content">
      <div className="return-container">
        <button className="back-btn" onClick={onBack}>← Dashboard</button>
        <h2 className="return-title">Return Book</h2>
        <p className="return-description">Enter the Student ID to view borrowed books.</p>
        {message && <p className="message">{message}</p>}
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
          <button type="submit" className="return-btn" disabled={loading}>
            {loading ? 'Loading...' : 'See Borrowed'}
          </button>
        </form>
        {borrowedBooks.length > 0 && (
          <div className="borrowed-list">
            <h3>Borrowed Books:</h3>
            <ul>
              {borrowedBooks.map((book) => (
                <li key={book.borrow_id}>
                  <strong>{book.title}</strong> by {book.author} (Due: {book.due_date}, Borrowed: {new Date(book.borrowed_at).toLocaleDateString()})
                  <button onClick={() => handleReturn(book.borrow_id)} className="return-book-btn">Return</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReturnUI;