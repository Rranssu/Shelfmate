// models/authModel.js
const db = require('../config/db');

const AuthModel = {
  createLibrary: (libraryName, libraryType, email, uid, callback) => {
    const query = 'INSERT INTO libraries (name, type, email, uid) VALUES (?, ?, ?, ?)';
    db.execute(query, [libraryName, libraryType, email, uid], callback);
  },

  createAdminUser: (name, email, hashedPassword, uid, callback) => {
    const query = 'INSERT INTO users (name, email, password, library_uid, is_admin) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [name, email, hashedPassword, uid, true], callback);
  },

  findUserByEmail: (email, callback) => {
    const query = `
      SELECT u.password, l.name as library_name, l.type as library_type, l.uid as library_uid
      FROM users u
      JOIN libraries l ON u.library_uid = l.uid
      WHERE u.email = ? AND u.is_admin = TRUE
    `;
    db.execute(query, [email], callback);
  },

  findAdminByUid: (libraryUid, callback) => {
    const query = 'SELECT password FROM users WHERE library_uid = ? AND is_admin = TRUE LIMIT 1';
    db.execute(query, [libraryUid], callback);
  }
};

module.exports = AuthModel;