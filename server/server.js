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

// MySQL Connection (adjust credentials as needed for XAMPP)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP password is empty
  database: 'shelfmate'  // Updated database name
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

// API Routes

// Register Library
app.post('/api/register', async (req, res) => {
  const { libraryName, libraryType, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = generateUID();
    
    const query = 'INSERT INTO libraries (name, type, email, password, uid) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [libraryName, libraryType, email, hashedPassword, uid], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'Registration successful', library_uid: uid });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Library
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const query = 'SELECT * FROM libraries WHERE email = ?';
  db.execute(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const library = results[0];
    const isValidPassword = await bcrypt.compare(password, library.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({
      library_name: library.name,
      library_type: library.type,
      library_uid: library.uid
    });
  });
});

// Admin Login
app.post('/api/admin-login', (req, res) => {
  const { password, libraryUid } = req.body;
  
  const query = 'SELECT admin_password FROM libraries WHERE uid = ?';
  db.execute(query, [libraryUid], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Library not found' });
    }
    
    const library = results[0];
    if (!library.admin_password) {
      return res.status(400).json({ message: 'Admin password not set for this library' });
    }
    
    const isValidPassword = await bcrypt.compare(password, library.admin_password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid admin password' });
    }
    
    res.json({ message: 'Admin login successful' });
  });
});

// Log Entry
app.post('/api/log-entry', (req, res) => {
  const { libraryUid, studentId } = req.body;
  
  // Check if library exists
  const libraryQuery = 'SELECT id FROM libraries WHERE uid = ?';
  db.execute(libraryQuery, [libraryUid], (err, libraryResults) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (libraryResults.length === 0) return res.status(404).json({ message: 'Library not found' });
    
    // Insert or update student
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
  
  // Check if library exists
  const libraryQuery = 'SELECT id FROM libraries WHERE uid = ?';
  db.execute(libraryQuery, [libraryUid], (err, libraryResults) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (libraryResults.length === 0) return res.status(404).json({ message: 'Library not found' });
    
    // Search for available book
    const bookQuery = 'SELECT * FROM books WHERE library_uid = ? AND available = TRUE AND (title LIKE ? OR author LIKE ?)';
    const searchPattern = `%${searchQuery}%`;
    db.execute(bookQuery, [libraryUid, searchPattern, searchPattern], (err, bookResults) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (bookResults.length === 0) return res.status(404).json({ message: 'No available book found matching the search' });
      
      const book = bookResults[0]; // Take the first match
      
      // Insert student if not exists
      const studentQuery = 'INSERT INTO students (student_id, library_uid) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id';
      db.execute(studentQuery, [studentId, libraryUid], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        // Create borrow record
        const borrowQuery = 'INSERT INTO borrows (student_id, book_id, library_uid, due_date) VALUES (?, ?, ?, ?)';
        db.execute(borrowQuery, [studentId, book.id, libraryUid, dueDate], (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          
          // Mark book as unavailable
          const updateBookQuery = 'UPDATE books SET available = FALSE WHERE id = ?';
          db.execute(updateBookQuery, [book.id], (err) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ message: `Book "${book.title}" borrowed successfully` });
          });
        });
      });
    });
  });
});

// Get Borrowed Books
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

// Return Book
app.post('/api/return-book', (req, res) => {
  const { borrowId } = req.body;
  
  // Get book_id from borrow record
  const getBorrowQuery = 'SELECT book_id FROM borrows WHERE id = ? AND returned = FALSE';
  db.execute(getBorrowQuery, [borrowId], (err, borrowResults) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (borrowResults.length === 0) return res.status(404).json({ message: 'Borrow record not found or already returned' });
    
    const bookId = borrowResults[0].book_id;
    
    // Mark borrow as returned
    const returnQuery = 'UPDATE borrows SET returned = TRUE WHERE id = ?';
    db.execute(returnQuery, [borrowId], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      // Mark book as available
      const updateBookQuery = 'UPDATE books SET available = TRUE WHERE id = ?';
      db.execute(updateBookQuery, [bookId], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Book returned successfully' });
      });
    });
  });
});

// Get Student Info and Borrowed Books (for ReturnListUI)
app.get('/api/student-books', (req, res) => {
  const { libraryUid, studentId } = req.query;
  
  // Get student info
  const studentQuery = 'SELECT name FROM students WHERE student_id = ? AND library_uid = ?';
  db.execute(studentQuery, [studentId, libraryUid], (err, studentResults) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    
    const studentName = studentResults.length > 0 ? studentResults[0].name : 'Unknown';
    
    // Get borrowed books
    const booksQuery = `
      SELECT b.id as borrow_id, bk.title, bk.author, br.due_date, br.borrowed_at
      FROM borrows br
      JOIN books bk ON br.book_id = bk.id
      WHERE br.library_uid = ? AND br.student_id = ? AND br.returned = FALSE
    `;
    
    db.execute(booksQuery, [libraryUid, studentId], (err, booksResults) => {
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

// Get Users (for AdminUsers component)
app.get('/api/users', (req, res) => {
  const { libraryUid } = req.query;
  
  if (!libraryUid) {
    return res.status(400).json({ message: 'Library UID required' });
  }
  
  const query = 'SELECT id, name, email, library_uid FROM users WHERE library_uid = ?';
  db.execute(query, [libraryUid], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ users: results });
  });
});

// Add User
app.post('/api/users', (req, res) => {
  const { name, email, libraryUid } = req.body;
  
  if (!name || !email || !libraryUid) {
    return res.status(400).json({ message: 'Name, email, and library UID are required' });
  }
  
  const query = 'INSERT INTO users (name, email, library_uid) VALUES (?, ?, ?)';
  db.execute(query, [name, email, libraryUid], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'User added successfully', userId: result.insertId });
  });
});

// Update User
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, libraryUid } = req.body;
  
  if (!name || !email || !libraryUid) {
    return res.status(400).json({ message: 'Name, email, and library UID are required' });
  }
  
  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ? AND library_uid = ?';
  db.execute(query, [name, email, id, libraryUid], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or not authorized' });
    }
    res.json({ message: 'User updated successfully' });
  });
});

// Delete User
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { libraryUid } = req.body;
  
  if (!libraryUid) {
    return res.status(400).json({ message: 'Library UID required' });
  }
  
  const query = 'DELETE FROM users WHERE id = ? AND library_uid = ?';
  db.execute(query, [id, libraryUid], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or not authorized' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Get Books (for AdminInventory component)
app.get('/api/books', (req, res) => {
  const { libraryUid } = req.query;
  
  if (!libraryUid) {
    return res.status(400).json({ message: 'Library UID required' });
  }
  
  const query = 'SELECT id, title, author, library_uid FROM books WHERE library_uid = ?';
  db.execute(query, [libraryUid], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ books: results });
  });
});

// Add Book
app.post('/api/books', (req, res) => {
  const { title, author, libraryUid } = req.body;
  
  if (!title || !author || !libraryUid) {
    return res.status(400).json({ message: 'Title, author, and library UID are required' });
  }
  
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
  
  if (!title || !author || !libraryUid) {
    return res.status(400).json({ message: 'Title, author, and library UID are required' });
  }
  
  const query = 'UPDATE books SET title = ?, author = ? WHERE id = ? AND library_uid = ?';
  db.execute(query, [title, author, id, libraryUid], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found or not authorized' });
    }
    res.json({ message: 'Book updated successfully' });
  });
});

// Delete Book
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { libraryUid } = req.body;
  
  if (!libraryUid) {
    return res.status(400).json({ message: 'Library UID required' });
  }
  
  const query = 'DELETE FROM books WHERE id = ? AND library_uid = ?';
  db.execute(query, [id, libraryUid], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found or not authorized' });
    }
    res.json({ message: 'Book deleted successfully' });
  });
});

// Get Logs (for EntryLogbook component)
app.get('/api/logs', (req, res) => {
  const { libraryUid } = req.query;
  
  if (!libraryUid) {
    return res.status(400).json({ message: 'Library UID required' });
  }
  
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
