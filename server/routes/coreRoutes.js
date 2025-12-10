// routes/coreRoutes.js
const express = require('express');
const CoreModel = require('../models/coreModel');
const router = express.Router();

// Log Entry
router.post('/log-entry', (req, res) => {
  const { libraryUid, studentId } = req.body;
  CoreModel.checkStudent(studentId, libraryUid, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error checking student' });
    if (results.length === 0) return res.status(404).json({ message: 'Student ID not registered.' });

    const studentName = results[0].name;
    CoreModel.logEntry(libraryUid, studentId, (err) => {
      if (err) return res.status(500).json({ message: 'Database error logging entry' });
      res.json({ message: `Entry logged for ${studentName}` });
    });
  });
});

// Borrow Book
router.post('/borrow-book', (req, res) => {
  const { libraryUid, studentId, searchQuery, dueDate } = req.body;

  CoreModel.findBookForBorrow(libraryUid, searchQuery, (err, bookResults) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (bookResults.length === 0) return res.status(404).json({ message: 'No available book found' });

    const book = bookResults[0];

    CoreModel.checkStudent(studentId, libraryUid, (err, studentResults) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (studentResults.length === 0) return res.status(404).json({ message: 'Student ID not registered.' });

      CoreModel.createBorrow(studentId, book.id, libraryUid, dueDate, (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        CoreModel.updateBookStatus(book.id, false, (err) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          res.json({ message: `Book "${book.title}" borrowed successfully` });
        });
      });
    });
  });
});

// Return Book
router.post('/return-book', (req, res) => {
  const { borrowId } = req.body;
  CoreModel.findBorrowById(borrowId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Record not found' });

    const bookId = results[0].book_id;
    CoreModel.returnBorrow(borrowId, (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      CoreModel.updateBookStatus(bookId, true, (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Book returned successfully' });
      });
    });
  });
});

// Get Borrowed Books (General)
router.get('/borrowed-books', (req, res) => {
  const { libraryUid, studentId } = req.query;
  CoreModel.getBorrowedBooks(libraryUid, studentId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ borrowedBooks: results });
  });
});

// Get Student Info & Books (Specific UI)
router.get('/student-books', (req, res) => {
  const { libraryUid, studentId } = req.query;
  CoreModel.checkStudent(studentId, libraryUid, (err, studentResults) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    
    const studentName = studentResults.length > 0 ? studentResults[0].name : 'Unknown';
    CoreModel.getBorrowedBooks(libraryUid, studentId, (err, booksResults) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({
        studentName,
        borrowedBooks: booksResults.map(book => ({
          id: book.borrow_id,
          title: book.title,
          author: book.author,
          dueDate: book.due_date,
          borrowedAt: book.borrowed_at
        }))
      });
    });
  });
});

module.exports = router;