const express = require('express');
const AdminModel = require('../models/adminModel');
const router = express.Router();

router.get('/students', (req, res) => {
  AdminModel.getAllStudents(req.query.libraryUid, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ users: results });
  });
});

router.post('/students', (req, res) => {
  const { name, student_id, libraryUid } = req.body;
  AdminModel.addStudent(name, student_id, libraryUid, (err) => {
    if (err) return res.status(500).json({ message: err.code === 'ER_DUP_ENTRY' ? 'ID exists' : 'Database error' });
    res.status(201).json({ message: 'Student added' });
  });
});

router.put('/students/:id', (req, res) => {
  AdminModel.updateStudent(req.body.name, req.body.student_id, req.params.id, req.body.libraryUid, (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Student updated' });
  });
});

router.delete('/students/:id', (req, res) => {
  AdminModel.deleteStudent(req.params.id, req.body.libraryUid, (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Student deleted' });
  });
});

router.get('/books', (req, res) => {
  AdminModel.getAllBooks(req.query.libraryUid, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ books: results });
  });
});

router.post('/books', (req, res) => {
  AdminModel.addBook(req.body.title, req.body.author, req.body.libraryUid, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ message: 'Book added', bookId: result.insertId });
  });
});

router.put('/books/:id', (req, res) => {
  AdminModel.updateBook(req.body.title, req.body.author, req.params.id, req.body.libraryUid, (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Book updated' });
  });
});

router.delete('/books/:id', (req, res) => {
  AdminModel.deleteBook(req.params.id, req.body.libraryUid, (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Book deleted' });
  });
});

// --- Logs ---
router.get('/logs', (req, res) => {
  AdminModel.getLogs(req.query.libraryUid, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ logs: results });
  });
});

module.exports = router;