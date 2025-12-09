import React, { useState } from 'react';
import { FaPlus, FaSort, FaEdit, FaTrash } from 'react-icons/fa';
import './styles/adminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', library_id: 1 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', library_id: 1 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', library_id: 2 }
  ]);
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', library_id: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'email') return a.email.localeCompare(b.email);
    return 0;
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.library_id) {
      setUsers([...users, { ...newUser, id: Date.now() }]);
      setNewUser({ name: '', email: '', library_id: '' });
      setShowAddModal(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email, library_id: user.library_id });
  };

  const handleUpdateUser = () => {
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...newUser } : u));
    setEditingUser(null);
    setNewUser({ name: '', email: '', library_id: '' });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter(u => u.id !== userToDelete.id));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="admin-users-wrapper">
      <div className="admin-users-container">
        <h2>Users Management</h2>
        <div className="users-controls">
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add User
          </button>
          <div className="sort-controls">
            <FaSort />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
            </select>
          </div>
        </div>

        {editingUser && (
          <div className="user-form">
            <h3>Edit User</h3>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="number"
              placeholder="Library ID"
              value={newUser.library_id}
              onChange={(e) => setNewUser({ ...newUser, library_id: e.target.value })}
            />
            <button onClick={handleUpdateUser}>Update</button>
            <button onClick={() => setEditingUser(null)}>Cancel</button>
          </div>
        )}

        <div className="users-list">
          {sortedUsers.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-details">
                <p><strong>{user.name}</strong></p>
                <p>{user.email}</p>
                <p>Library ID: {user.library_id}</p>
              </div>
              <div className="user-actions">
                <button className="edit-btn" onClick={() => handleEditUser(user)}>
                  <FaEdit /> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDeleteClick(user)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="add-modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="add-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Add New User</h3>
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                type="number"
                placeholder="Library ID"
                value={newUser.library_id}
                onChange={(e) => setNewUser({ ...newUser, library_id: e.target.value })}
              />
              <div className="modal-actions">
                <button onClick={handleAddUser}>Add</button>
                <button onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="delete-modal-overlay" onClick={cancelDelete}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete <strong>{userToDelete?.name}</strong>?</p>
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

export default AdminUsers;