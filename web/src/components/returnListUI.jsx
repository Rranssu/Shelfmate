import React, { useState, useEffect } from 'react';
import './styles/returnListUI.css';

function ReturnListUI({ studentId, onBack, libraryUid }) {
  const [studentName, setStudentName] = useState('');
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!libraryUid || !studentId) {
      setMessage('Error: Missing library UID or student ID');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/student-books?libraryUid=${libraryUid}&studentId=${studentId}`);
        const data = await response.json();
        if (response.ok) {
          setStudentName(data.studentName);
          setBorrowedBooks(data.borrowedBooks);
        } else {
          setMessage(data.message || 'Failed to fetch data');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Network error. Please try again.');
      }
      setLoading(false);
    };

    fetchData();
  }, [libraryUid, studentId]);

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
        setBorrowedBooks(borrowedBooks.filter(book => book.id !== borrowId));
      } else {
        setMessage(data.message || 'Failed to return book');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="return-list-content">
      <div className="return-list-container">
        <button className="back-btn" onClick={onBack}>← Dashboard</button>
        <h2 className="return-list-title">Borrowed Books</h2>
        {message && <p className="message">{message}</p>}
        <div className="student-info">
          <p><strong>Student Name:</strong> {studentName}</p>
          <p><strong>Student ID:</strong> {studentId}</p>
        </div>
        <div className="borrowed-books">
          {borrowedBooks.length > 0 ? (
            borrowedBooks.map((book) => (
              <div key={book.id} className="book-item">
                <div className="book-details">
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Due Date:</strong> {book.dueDate}</p>
                  <p><strong>Borrowed At:</strong> {new Date(book.borrowedAt).toLocaleDateString()}</p>
                </div>
                <button className="return-book-btn" onClick={() => handleReturn(book.id)}>Return</button>
              </div>
            ))
          ) : (
            <p>No borrowed books found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ReturnListUI;