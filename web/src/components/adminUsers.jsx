import React, { useState, useEffect } from 'react';
import { FaPlus, FaSort, FaEdit, FaTrash } from 'react-icons/fa';
import './styles/adminUsers.css';

function AdminUsers({ libraryUid }) {
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!libraryUid) return;
    fetchUsers();
  }, [libraryUid]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users?libraryUid=${libraryUid}`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      } else {
        setMessage(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
    setLoading(false);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'email') return a.email.localeCompare(b.email);
    return 0;
  });

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, libraryUid }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('User added successfully');
        setNewUser({ name: '', email: '' });
        setShowAddModal(false);
        fetchUsers(); // Refresh list
      } else {
        setMessage(data.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, libraryUid }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('User updated successfully');
        setEditingUser(null);
        setNewUser({ name: '', email: '' });
        fetchUsers(); // Refresh list
      } else {
        setMessage(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libraryUid }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('User deleted successfully');
        setShowDeleteModal(false);
        setUserToDelete(null);
        fetchUsers(); // Refresh list
      } else {
        setMessage(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-users-wrapper">
      <div className="admin-users-container">
        <h2>Users Management</h2>
        {message && <p className="message">{message}</p>}
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
