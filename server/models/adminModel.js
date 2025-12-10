// models/adminModel.js
const db = require('../config/db');

const AdminModel = {
  // Students
  getAllStudents: (uid, cb) => db.execute('SELECT id, student_id, name FROM students WHERE library_uid = ? ORDER BY name ASC', [uid], cb),
  addStudent: (name, sid, uid, cb) => db.execute('INSERT INTO students (name, student_id, library_uid) VALUES (?, ?, ?)', [name, sid, uid], cb),
  updateStudent: (name, sid, id, uid, cb) => db.execute('UPDATE students SET name = ?, student_id = ? WHERE id = ? AND library_uid = ?', [name, sid, id, uid], cb),
  deleteStudent: (id, uid, cb) => db.execute('DELETE FROM students WHERE id = ? AND library_uid = ?', [id, uid], cb),

  // Books
  getAllBooks: (uid, cb) => db.execute('SELECT id, title, author, library_uid FROM books WHERE library_uid = ?', [uid], cb),
  addBook: (t, a, uid, cb) => db.execute('INSERT INTO books (title, author, library_uid) VALUES (?, ?, ?)', [t, a, uid], cb),
  updateBook: (t, a, id, uid, cb) => db.execute('UPDATE books SET title = ?, author = ? WHERE id = ? AND library_uid = ?', [t, a, id, uid], cb),
  deleteBook: (id, uid, cb) => db.execute('DELETE FROM books WHERE id = ? AND library_uid = ?', [id, uid], cb),

  // Logs
  getLogs: (uid, cb) => {
    const q = `SELECT l.student_id, s.name, l.logged_at FROM logs l LEFT JOIN students s ON l.student_id = s.student_id AND l.library_uid = s.library_uid WHERE l.library_uid = ? ORDER BY l.logged_at DESC`;
    db.execute(q, [uid], cb);
  }
};

module.exports = AdminModel;