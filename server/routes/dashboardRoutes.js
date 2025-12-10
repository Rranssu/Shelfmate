const express = require('express');
const DashboardModel = require('../models/dashboardModel');
const router = express.Router();

router.get('/inventory-summary', (req, res) => {
  DashboardModel.getInventorySummary(req.query.libraryUid, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    const row = results[0];
    res.json({ totalBooks: row.totalBooks, availableBooks: row.availableBooks || 0, borrowedBooks: row.totalBooks - (row.availableBooks || 0) });
  });
});

router.get('/dashboard/today-stats', (req, res) => {
  DashboardModel.getTodayStats(req.query.libraryUid, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results[0]);
  });
});

router.get('/dashboard/recent-transactions', (req, res) => {
  DashboardModel.getRecentTransactions(req.query.libraryUid, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    const transactions = results.map(row => ({
      student: row.student,
      book: row.book,
      action: row.returned ? 'Returned' : 'Borrowed',
      time: row.borrowed_at
    }));
    res.json({ transactions });
  });
});

module.exports = router;