import React from 'react';
import './styles/returnListUI.css';

function ReturnListUI({ studentId, onBack }) {
  const studentName = "John Doe";
  const borrowedBooks = [
    { id: 1, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", dueDate: "2023-10-15" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", dueDate: "2023-10-20" },
    { id: 3, title: "1984", author: "George Orwell", dueDate: "2023-10-25" }
  ];

  const handleReturn = (bookId) => {
    console.log('Returning book ID:', bookId);
  };

  return (
    <section className="return-list-content">
      <div className="return-list-container">
        <button className="back-btn" onClick={onBack}>← Dashboard</button>
        <h2 className="return-list-title">Borrowed Books</h2>
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

