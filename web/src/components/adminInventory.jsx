import React, { useState } from 'react';
import { FaPlus, FaSort, FaEdit, FaTrash, FaBook } from 'react-icons/fa';
import './styles/adminInventory.css';

function AdminInventory() {
  const [books, setBooks] = useState([
    { id: 1, title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', library_id: 1 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', library_id: 1 },
    { id: 3, title: '1984', author: 'George Orwell', library_id: 2 }
  ]);
  const [sortBy, setSortBy] = useState('title');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [newBook, setNewBook] = useState({ title: '', author: '', library_id: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'author') return a.author.localeCompare(b.author);
    return 0;
  });

  const handleAddBook = () => {
    if (newBook.title && newBook.author && newBook.library_id) {
      setBooks([...books, { ...newBook, id: Date.now() }]);
      setNewBook({ title: '', author: '', library_id: '' });
      setShowAddModal(false);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBook({ title: book.title, author: book.author, library_id: book.library_id });
  };

  const handleUpdateBook = () => {
    setBooks(books.map(b => b.id === editingBook.id ? { ...b, ...newBook } : b));
    setEditingBook(null);
    setNewBook({ title: '', author: '', library_id: '' });
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setBooks(books.filter(b => b.id !== bookToDelete.id));
    setShowDeleteModal(false);
    setBookToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBookToDelete(null);
  };

  return (
    <div className="admin-inventory-wrapper">
      <div className="admin-inventory-container">
        <h2>Inventory Management</h2>
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
            <input
              type="number"
              placeholder="Library ID"
              value={newBook.library_id}
              onChange={(e) => setNewBook({ ...newBook, library_id: e.target.value })}
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
                <p>Library ID: {book.library_id}</p>
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
              <input
                type="number"
                placeholder="Library ID"
                value={newBook.library_id}
                onChange={(e) => setNewBook({ ...newBook, library_id: e.target.value })}
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