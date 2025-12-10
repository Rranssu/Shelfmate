const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const AuthModel = require('../models/authModel');
const router = express.Router();
router.post('/register', async (req, res) => {
  const { libraryName, libraryType, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = uuidv4();

    AuthModel.createLibrary(libraryName, libraryType, email, uid, (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already exists' });
        return res.status(500).json({ message: 'Database error creating library' });
      }
      AuthModel.createAdminUser('Admin', email, hashedPassword, uid, (err) => {
        if (err) return res.status(500).json({ message: 'Library created, but failed to create Admin user' });
        res.status(201).json({ message: 'Registration successful', library_uid: uid });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  AuthModel.findUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      library_name: user.library_name,
      library_type: user.library_type,
      library_uid: user.library_uid
    });
  });
});

router.post('/admin-login', (req, res) => {
  const { password, libraryUid } = req.body;
  AuthModel.findAdminByUid(libraryUid, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Admin account not found' });

    const isValid = await bcrypt.compare(password, results[0].password);
    if (!isValid) return res.status(401).json({ message: 'Invalid admin password' });

    res.json({ message: 'Admin login successful' });
  });
});

module.exports = router;