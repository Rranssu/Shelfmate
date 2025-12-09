import React, { useState, useEffect } from 'react';
import { FaPlus, FaSort, FaEdit, FaTrash } from 'react-icons/fa';
import './styles/adminInventory.css';

function AdminInventory({ libraryUid }) {
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!libraryUid) return;
    fetchBooks();
  }, [libraryUid]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books?libraryUid=${libraryUid}`);
      const data = await response.json();
      if (response.ok) {
        setBooks(data.books);
      } else {
        setMessage(data.message || 'Failed to fetch books');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
    setLoading(false);
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'author') return a.author.localeCompare(b.author);
    return 0;
  });

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBook, libraryUid }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Book added successfully');
        setNewBook({ title: '', author: '' });
        setShowAddModal(false);
        fetchBooks(); // Refresh list
      } else {
        setMessage(data.message || 'Failed to add book');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBook({ title: book.title, author: book.author });
  };

  const handleUpdateBook = async () => {
    if (!editingBook) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/books/${editingBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBook, libraryUid }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Book updated successfully');
        setEditingBook(null);
        setNewBook({ title: '', author: '' });
        fetchBooks(); // Refresh list
      } else {
        setMessage(data.message || 'Failed to update book');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libraryUid }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Book deleted successfully');
        setShowDeleteModal(false);
        setBookToDelete(null);
        fetchBooks(); // Refresh list
      } else {
        setMessage(data.message || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBookToDelete(null);
  };

  if (loading) return <p>Loading books...</p>;

  return (
    <div className="admin-inventory-wrapper">
      <div className="admin-inventory-container">
        <h2>Inventory Management</h2>
        {message && <p className="message">{message}</p>}
        <div className="inventory-controls">
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Book
          </button>
          <div className="sort-controls">
            <FaSort />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
            </select>
          </div>
        </div>

        {editingBook && (
          <div className="book-form">
            <h3>Edit Book</h3>
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <button onClick={handleUpdateBook}>Update</button>
            <button onClick={() => setEditingBook(null)}>Cancel</button>
          </div>
        )}

        <div className="books-list">
          {sortedBooks.map(book => (
            <div key={book.id} className="book-item">
              <div className="book-details">
                <p><strong>{book.title}</strong></p>
                <p>by {book.author}</p>
              </div>
              <div className="book-actions">
                <button className="edit-btn" onClick={() => handleEditBook(book)}>
                  <FaEdit /> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDeleteClick(book)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="add-modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="add-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Add New Book</h3>
              <input
                type="text"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              />
              <div className="modal-actions">
                <button onClick={handleAddBook}>Add</button>
                <button onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="delete-modal-overlay" onClick={cancelDelete}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete <strong>{bookToDelete?.title}</strong>?</p>
              <div className="modal-actions">
                <button className="confirm-btn" onClick={confirmDelete}>Yes, Delete</button>
                <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInventory;
