import React, { useState, useEffect } from 'react';
import { FaPlus, FaSort, FaEdit, FaTrash, FaIdBadge } from 'react-icons/fa';
import './styles/adminUsers.css';

function AdminUsers({ libraryUid }) {
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [editingUser, setEditingUser] = useState(null);

  const [newUser, setNewUser] = useState({ name: '', student_id: '' });
  
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
      const response = await fetch(`http://localhost:5000/api/students?libraryUid=${libraryUid}`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      } else {
        setMessage(data.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
    setLoading(false);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'student_id') return a.student_id.localeCompare(b.student_id);
    return 0;
  });

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.student_id) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, libraryUid }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Student added successfully');
        setNewUser({ name: '', student_id: '' });
        setShowAddModal(false);
        fetchUsers();
      } else {
        setMessage(data.message || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ name: user.name, student_id: user.student_id });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/students/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, libraryUid }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Student updated successfully');
        setEditingUser(null);
        setNewUser({ name: '', student_id: '' });
        fetchUsers();
      } else {
        setMessage(data.message || 'Failed to update student');
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
      const response = await fetch(`http://localhost:5000/api/students/${userToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libraryUid }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Student deleted successfully');
        setShowDeleteModal(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        setMessage(data.message || 'Failed to delete student');
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

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="admin-users-wrapper">
      <div className="admin-users-container">
        <h2>Student Management</h2>
        {message && <p className="message">{message}</p>}
        
        <div className="users-controls">
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Student
          </button>
          <div className="sort-controls">
            <FaSort />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="student_id">Sort by ID</option>
            </select>
          </div>
        </div>

        {editingUser && (
          <div className="user-form">
            <h3>Edit Student</h3>
            <input
              type="text"
              placeholder="Student Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="School ID Number"
              value={newUser.student_id}
              onChange={(e) => setNewUser({ ...newUser, student_id: e.target.value })}
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
                <p style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
                    <FaIdBadge /> {user.student_id}
                </p>
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
              <h3>Add New Student</h3>
              <input
                type="text"
                placeholder="Student Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="School ID Number"
                value={newUser.student_id}
                onChange={(e) => setNewUser({ ...newUser, student_id: e.target.value })}
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