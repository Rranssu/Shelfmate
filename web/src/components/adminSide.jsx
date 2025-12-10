import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBook, FiUsers, FiLogOut } from "react-icons/fi";
import { FaRegAddressBook } from "react-icons/fa6";
import "./styles/adminSide.css";

// Accept props
export default function AdminSide({ libraryUid, libraryName }) {
  const location = useLocation();

  // Helper to check active link
  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        {/* You can put your logo image here */}
        <h3 style={{ marginTop: "10px", fontWeight: "bold" }}>Admin Panel</h3>
        <p style={{ fontSize: "12px", color: "#ccc" }}>{libraryName}</p>
      </div>

      <div className="sidebar-menu">
        {/* KEY CHANGE: Pass state={{ libraryUid }} in every link */}
        
        <Link 
          to="/admin" 
          state={{ libraryUid, libraryName }}
          className={`menu-item ${isActive("/admin") ? "active" : ""}`}
        >
          <FiHome className="menu-icon" /> Dashboard
        </Link>

        <Link 
          to="/admin/users" 
          state={{ libraryUid, libraryName }}
          className={`menu-item ${isActive("/admin/users") ? "active" : ""}`}
        >
          <FiUsers className="menu-icon" /> Users
        </Link>

        <Link 
          to="/admin/inventory" 
          state={{ libraryUid, libraryName }}
          className={`menu-item ${isActive("/admin/inventory") ? "active" : ""}`}
        >
          <FiBook className="menu-icon" /> Inventory
        </Link>

        <Link 
          to="/admin/logbook" 
          state={{ libraryUid, libraryName }}
          className={`menu-item ${isActive("/admin/logbook") ? "active" : ""}`}
        >
          <FaRegAddressBook className="menu-icon" /> Entry Logbook
        </Link>

        <Link to="/register" className="menu-item logout">
          <FiLogOut className="menu-icon" /> Logout
        </Link>
      </div>
    </div>
  );
}