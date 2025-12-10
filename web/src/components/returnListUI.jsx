import React, { useState, useEffect } from 'react';
import './styles/returnListUI.css';

function ReturnListUI({ studentId, onBack, libraryUid }) {
  const [studentName, setStudentName] = useState('Unknown');
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!libraryUid || !studentId) {
      setMessage('Error: Missing credentials');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Calls the endpoint specifically designed for this list
        const response = await fetch(`http://localhost:5000/api/student-books?libraryUid=${libraryUid}&studentId=${studentId}`);
        const data = await response.json();
        
        if (response.ok) {
          setStudentName(data.studentName || 'Student');
          setBorrowedBooks(data.borrowedBooks || []);
          if (data.borrowedBooks && data.borrowedBooks.length === 0) {
            setMessage('This student has no borrowed books.');
          }
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
        // Remove the returned book from the local list immediately
        setBorrowedBooks((prevBooks) => prevBooks.filter(book => book.id !== borrowId));
      } else {
        setMessage(data.message || 'Failed to return book');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  if (loading) return (
    <div className="return-list-content">
      <div className="return-list-container">
        <p>Loading records...</p>
      </div>
    </div>
  );

  return (
    <section className="return-list-content">
      <div className="return-list-container">
        <button className="back-btn" onClick={onBack}>← Back to Search</button>
        <h2 className="return-list-title">Borrowed Books</h2>
        
        <div className="student-info">
          <p><strong>Student Name:</strong> {studentName}</p>
          <p><strong>Student ID:</strong> {studentId}</p>
        </div>

        {message && <p className={`message ${message.includes('successfully') ? 'success' : ''}`}>{message}</p>}
        
        <div className="borrowed-books">
          {borrowedBooks.length > 0 ? (
            borrowedBooks.map((book) => (
              <div key={book.id} className="book-item">
                <div className="book-details">
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Due:</strong> {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <button className="return-book-btn" onClick={() => handleReturn(book.id)}>
                  Return Book
                </button>
              </div>
            ))
          ) : (
            !loading && <p className="no-books">No active loans found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ReturnListUI;