const db = require('../config/db');

const CoreModel = {
  checkStudent: (studentId, libraryUid, callback) => {
    const query = 'SELECT id, name FROM students WHERE student_id = ? AND library_uid = ?';
    db.execute(query, [studentId, libraryUid], callback);
  },

  logEntry: (libraryUid, studentId, callback) => {
    const query = 'INSERT INTO logs (library_uid, student_id) VALUES (?, ?)';
    db.execute(query, [libraryUid, studentId], callback);
  },

  findBookForBorrow: (libraryUid, searchQuery, callback) => {
    const query = 'SELECT * FROM books WHERE library_uid = ? AND available = TRUE AND (title LIKE ? OR author LIKE ?)';
    const pattern = `%${searchQuery}%`;
    db.execute(query, [libraryUid, pattern, pattern], callback);
  },

  createBorrow: (studentId, bookId, libraryUid, dueDate, callback) => {
    const query = 'INSERT INTO borrows (student_id, book_id, library_uid, due_date) VALUES (?, ?, ?, ?)';
    db.execute(query, [studentId, bookId, libraryUid, dueDate], callback);
  },

  updateBookStatus: (bookId, available, callback) => {
    const query = 'UPDATE books SET available = ? WHERE id = ?';
    db.execute(query, [available, bookId], callback);
  },

  findBorrowById: (borrowId, callback) => {
    const query = 'SELECT book_id FROM borrows WHERE id = ? AND returned = FALSE';
    db.execute(query, [borrowId], callback);
  },

  returnBorrow: (borrowId, callback) => {
    const query = 'UPDATE borrows SET returned = TRUE WHERE id = ?';
    db.execute(query, [borrowId], callback);
  },

  getBorrowedBooks: (libraryUid, studentId, callback) => {
    const query = `
      SELECT br.id as borrow_id, bk.title, bk.author, br.borrowed_at, br.due_date
      FROM borrows br
      JOIN books bk ON br.book_id = bk.id
      WHERE br.library_uid = ? AND br.student_id = ? AND br.returned = FALSE
    `;
    db.execute(query, [libraryUid, studentId], callback);
  }
};

module.exports = CoreModel;