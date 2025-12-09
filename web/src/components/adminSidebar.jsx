import React from 'react';
import { FaTachometerAlt, FaBook, FaBoxes, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './styles/adminSidebar.css';

function AdminSidebar({ onMenuClick }) {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <img src="/logos/shelf-mate-logo.png" alt="Shelf Mate Logo" className="logo-image" />
      </div>
      <nav className="sidebar-menu">
        <button className="menu-item active" onClick={() => onMenuClick('dashboard')}>
          <FaTachometerAlt className="menu-icon" />
          Dashboard
        </button>
        <button className="menu-item" onClick={() => onMenuClick('logbook')}>
          <FaBook className="menu-icon" />
          Logbook
        </button>
        <button className="menu-item" onClick={() => onMenuClick('inventory')}>
          <FaBoxes className="menu-icon" />
          Inventory
        </button>
        <button className="menu-item" onClick={() => onMenuClick('students')}>
          <FaUsers className="menu-icon" />
          Students
        </button>
        <button className="menu-item" onClick={() => onMenuClick('settings')}>
          <FaCog className="menu-icon" />
          Settings
        </button>
        <button className="menu-item logout" onClick={() => onMenuClick('logout')}>
          <FaSignOutAlt className="menu-icon" />
          Log Out
        </button>
      </nav>
    </aside>
  );
}

export default AdminSidebar;

