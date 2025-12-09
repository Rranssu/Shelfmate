import React from 'react';
import './styles/adminDueSummary.css';

function AdminDueSummary() {
  const overdueBooks = [
    { id: 1, student: 'Emma Davis', book: 'Moby Dick', dueDate: '2023-09-15' },
    { id: 2, student: 'Frank Miller', book: 'War and Peace', dueDate: '2023-09-18' },
    { id: 3, student: 'Grace Lee', book: 'The Catcher in the Rye', dueDate: '2023-09-20' }
  ];

  return (
    <div className="overdue-container">
      <h2>Overdue Books</h2>
      <div className="overdue-list">
        {overdueBooks.map((book) => (
          <div key={book.id} className="overdue-item">
            <div className="overdue-details">
              <p><strong>{book.student}</strong> - <em>{book.book}</em></p>
              <p className="overdue-date">Due: {book.dueDate}</p>
            </div>
            <button className="notify-btn">Notify</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDueSummary;

