const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP password
  database: 'shelfmate'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Helper function to generate UID
function generateUID() {
  return uuidv4();
}

// ==========================================
// 1. AUTHENTICATION & REGISTRATION ROUTES
// ==========================================

// Register Library & Admin User
app.post('/api/register', async (req, res) => {
  const { libraryName, libraryType, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = generateUID();
    
    // 1. Create Library
    const libQuery = 'INSERT INTO libraries (name, type, email, uid) VALUES (?, ?, ?, ?)';
    db.execute(libQuery, [libraryName, libraryType, email, uid], (err, libResult) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already exists' });
        return res.status(500).json({ message: 'Database error creating library' });
      }

      // 2. Create Admin User
      const userQuery = 'INSERT INTO users (name, email, password, library_uid, is_admin) VALUES (?, ?, ?, ?, ?)';
      db.execute(userQuery, ['Admin', email, hashedPassword, uid, true], (err, userResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Library created, but failed to create Admin user' });
        }
        res.status(201).json({ message: 'Registration successful', library_uid: uid });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Login (Checks Users Table)
app.post('/api/admin-login', (req, res) => {
  const { password, libraryUid } = req.body;
  
  // Find the admin user for this library
  const query = 'SELECT password FROM users WHERE library_uid = ? AND is_admin = TRUE LIMIT 1';
  
  db.execute(query, [libraryUid], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Admin account not found' });
    }
    
    const adminUser = results[0];
    const isValidPassword = await bcrypt.compare(password, adminUser.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid admin password' });
    }
    
    res.json({ message: 'Admin login successful' });
  });
});

// ==========================================
// 2. DASHBOARD OPERATIONS (Log, Borrow, Return)
// ==========================================

// Log Student Entry
app.post('/api/log-entry', (req, res) => {
  const { libraryUid, studentId } = req.body;
  
  const libraryQuery = 'SELECT id FROM libraries WHERE uid = ?';
  db.execute(libraryQuery, [libraryUid], (err, libraryResults) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (libraryResults.length === 0) return res.status(404).json({ message: 'Library not found' });
    
    // Ensure student exists in DB (Upsert)
    const studentQuery = 'INSERT INTO students (student_id, library_uid) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id';
    db.execute(studentQuery, [studentId, libraryUid], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      // Log the entry
      const logQuery = 'INSERT INTO logs (library_uid, student_id) VALUES (?, ?)';
      db.execute(logQuery, [libraryUid, studentId], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Entry logged successfully' });
      });
    });
  });
});

// Borrow Book
app.post('/api/borrow-book', (req, res) => {
  const { libraryUid, studentId, searchQuery, dueDate } = req.body;
  
  // Search for available book
  const bookQuery = 'SELECT * FROM books WHERE library_uid = ? AND available = TRUE AND (title LIKE ? OR author LIKE ?)';
  const searchPattern = `%${searchQuery}%`;
  
  db.execute(bookQuery, [libraryUid, searchPattern, searchPattern], (err, bookResults) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (bookResults.length === 0) return res.status(404).json({ message: 'No available book found matching search' });
    
    const book = bookResults[0]; // Take first match
    
    // Ensure student exists
    const studentQuery = 'INSERT INTO students (student_id, library_uid) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id';
    db.execute(studentQuery, [studentId, libraryUid], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      // Create borrow record
      const borrowQuery = 'INSERT INTO borrows (student_id, book_id, library_uid, due_date) VALUES (?, ?, ?, ?)';
      db.execute(borrowQuery, [studentId, book.id, libraryUid, dueDate], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        // Mark book unavailable
        const updateBookQuery = 'UPDATE books SET available = FALSE WHERE id = ?';
        db.execute(updateBookQuery, [book.id], (err) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          res.json({ message: `Book "${book.title}" borrowed successfully` });
        });
      });
    });
  });
});

// Return Book
app.post('/api/return-book', (req, res) => {
  const { borrowId } = req.body;
  
  const getBorrowQuery = 'SELECT book_id FROM borrows WHERE id = ? AND returned = FALSE';
  db.execute(getBorrowQuery, [borrowId], (err, borrowResults) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (borrowResults.length === 0) return res.status(404).json({ message: 'Borrow record not found' });
    
    const bookId = borrowResults[0].book_id;
    
    const returnQuery = 'UPDATE borrows SET returned = TRUE WHERE id = ?';
    db.execute(returnQuery, [borrowId], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      const updateBookQuery = 'UPDATE books SET available = TRUE WHERE id = ?';
      db.execute(updateBookQuery, [bookId], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Book returned successfully' });
      });
    });
  });
});

// Get Borrowed Books (General Search)
app.get('/api/borrowed-books', (req, res) => {
  const { libraryUid, studentId } = req.query;
  const query = `
    SELECT b.id as borrow_id, bk.title, bk.author, br.borrowed_at, br.due_date
    FROM borrows br
    JOIN books bk ON br.book_id = bk.id
    WHERE br.library_uid = ? AND br.student_id = ? AND br.returned = FALSE
  `;
  db.execute(query, [libraryUid, studentId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ borrowedBooks: results });
  });
});

// Get Student Info and Borrowed Books (Detailed List for ReturnListUI)
app.get('/api/student-books', (req, res) => {
  const { libraryUid, studentId } = req.query;
  
  // 1. Get student info
  const studentQuery = 'SELECT name FROM students WHERE student_id = ? AND library_uid = ?';
  
  db.execute(studentQuery, [studentId, libraryUid], (err, studentResults) => {
    if (err) {
      console.error("Error fetching student:", err); // Log the specific error to console
      return res.status(500).json({ message: 'Database error fetching student' });
    }
    
    const studentName = studentResults.length > 0 ? studentResults[0].name : 'Unknown';
    
    // 2. Get borrowed books
    // FIX: Changed 'b.id' to 'br.id' to match the table alias 'borrows br'
    const booksQuery = `
      SELECT br.id as borrow_id, bk.title, bk.author, br.due_date, br.borrowed_at
      FROM borrows br
      JOIN books bk ON br.book_id = bk.id
      WHERE br.library_uid = ? AND br.student_id = ? AND br.returned = FALSE
    `;
    
    db.execute(booksQuery, [libraryUid, studentId], (err, booksResults) => {
      if (err) {
        console.error("Error fetching books:", err); // Log the specific error to console
        return res.status(500).json({ message: 'Database error fetching books' });
      }
      
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

// ==========================================
// 3. ADMIN: STUDENT MANAGEMENT
// ==========================================

// Get All Students
app.get('/api/students', (req, res) => {
  const { libraryUid } = req.query;
  // Returning 'users' key to match frontend expectation in AdminUsers component
  const query = 'SELECT id, student_id, name FROM students WHERE library_uid = ? ORDER BY name ASC';
  db.execute(query, [libraryUid], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ users: results }); 
  });
});

// Add Student
app.post('/api/students', (req, res) => {
  const { name, student_id, libraryUid } = req.body;
  const query = 'INSERT INTO students (name, student_id, library_uid) VALUES (?, ?, ?)';
  db.execute(query, [name, student_id, libraryUid], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Student ID already exists' });
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Student added successfully' });
  });
});

// Update Student
app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, student_id, libraryUid } = req.body;
  const query = 'UPDATE students SET name = ?, student_id = ? WHERE id = ? AND library_uid = ?';
  db.execute(query, [name, student_id, id, libraryUid], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Student updated successfully' });
  });
});

// Delete Student
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { libraryUid } = req.body;
  const query = 'DELETE FROM students WHERE id = ? AND library_uid = ?';
  db.execute(query, [id, libraryUid], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Student deleted successfully' });
  });
});

// ==========================================
// 4. ADMIN: INVENTORY MANAGEMENT
// ==========================================

// Get Books
app.get('/api/books', (req, res) => {
  const { libraryUid } = req.query;
  const query = 'SELECT id, title, author, library_uid FROM books WHERE library_uid = ?';
  db.execute(query, [libraryUid], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ books: results });
  });
});

// Add Book
app.post('/api/books', (req, res) => {
  const { title, author, libraryUid } = req.body;
  const query = 'INSERT INTO books (title, author, library_uid) VALUES (?, ?, ?)';
  db.execute(query, [title, author, libraryUid], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
  });
});

// Update Book
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, libraryUid } = req.body;
  const query = 'UPDATE books SET title = ?, author = ? WHERE id = ? AND library_uid = ?';
  db.execute(query, [title, author, id, libraryUid], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Book updated successfully' });
  });
});

// Delete Book
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { libraryUid } = req.body;
  const query = 'DELETE FROM books WHERE id = ? AND library_uid = ?';
  db.execute(query, [id, libraryUid], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Book deleted successfully' });
  });
});

// ==========================================
// 5. ADMIN: LOGS
// ==========================================

// Get Logs
app.get('/api/logs', (req, res) => {
  const { libraryUid } = req.query;
  const query = `
    SELECT l.student_id, s.name, l.logged_at
    FROM logs l
    LEFT JOIN students s ON l.student_id = s.student_id AND l.library_uid = s.library_uid
    WHERE l.library_uid = ?
    ORDER BY l.logged_at DESC
  `;
  db.execute(query, [libraryUid], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ logs: results });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});