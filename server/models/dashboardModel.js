// models/dashboardModel.js
const db = require('../config/db');

const DashboardModel = {
  getInventorySummary: (uid, cb) => {
    const query = `SELECT COUNT(*) as totalBooks, SUM(CASE WHEN available = 1 THEN 1 ELSE 0 END) as availableBooks FROM books WHERE library_uid = ?`;
    db.execute(query, [uid], cb);
  },

  getTodayStats: (uid, cb) => {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM borrows WHERE library_uid = ? AND DATE(borrowed_at) = CURDATE()) as booksBorrowedToday,
        (SELECT COUNT(*) FROM logs WHERE library_uid = ? AND DATE(logged_at) = CURDATE()) as entriesToday,
        (SELECT COUNT(*) FROM borrows WHERE library_uid = ? AND returned = 0) as toBeReturned
    `;
    db.execute(query, [uid, uid, uid], cb);
  },

  getRecentTransactions: (uid, cb) => {
    const query = `
      SELECT s.name as student, b.title as book, br.returned, br.borrowed_at
      FROM borrows br
      JOIN students s ON br.student_id = s.student_id AND br.library_uid = s.library_uid
      JOIN books b ON br.book_id = b.id
      WHERE br.library_uid = ?
      ORDER BY br.borrowed_at DESC LIMIT 5
    `;
    db.execute(query, [uid], cb);
  }
};

module.exports = DashboardModel;