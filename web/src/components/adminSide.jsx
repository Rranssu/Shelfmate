import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBook, FiUsers, FiLogOut, FiArrowLeft } from "react-icons/fi"; // 1. Added FiArrowLeft
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
        <h3 style={{ marginTop: "10px", fontWeight: "bold" }}>Admin Panel</h3>
        <p style={{ fontSize: "12px", color: "#ccc" }}>{libraryName}</p>
      </div>

      <div className="sidebar-menu">
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>
        <Link 
          to="/dashboard" 
          state={{ libraryUid, libraryName }}
          className="menu-item"
        >
          <FiArrowLeft className="menu-icon" /> Back to Library
        </Link>
        <Link 
          to="/admin" 
          state={{ libraryUid, libraryName }}
          className={`menu-item ${isActive("/admin") ? "active" : ""}`}
        >
          <FiHome className="menu-icon" /> Overview
        </Link>

        <Link 
          to="/admin/users" 
          state={{ libraryUid, libraryName }}
          className={`menu-item ${isActive("/admin/users") ? "active" : ""}`}
        >
          <FiUsers className="menu-icon" /> Students
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

        <Link to="/" className="menu-item logout">
          <FiLogOut className="menu-icon" /> Logout
        </Link>
      </div>
    </div>
  );
}