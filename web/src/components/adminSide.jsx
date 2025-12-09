import React from "react";
import { Link } from "react-router-dom"; // Use Link for routing
import { FiHome, FiBook, FiUsers, FiLogOut, FiActivity } from "react-icons/fi";
import { FaRegAddressBook } from "react-icons/fa6";
import "./styles/adminSide.css";

export default function AdminSide() {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <img src="/logo.webp" alt="Logo" className="logo-image" />
        <h3 style={{ marginTop: "10px", fontWeight: "bold" }}>Admin Panel</h3>
      </div>

      <div className="sidebar-menu">
        <Link to="/admin" className="menu-item active">
          <FiHome className="menu-icon" /> Dashboard
        </Link>

        <Link to="/admin/users" className="menu-item">
          <FiUsers className="menu-icon" /> Users
        </Link>

        <Link to="/admin/inventory" className="menu-item">
          <FiBook className="menu-icon" /> Inventory
        </Link>

        <Link to="/admin/logbook" className="menu-item">
          <FaRegAddressBook className="menu-icon" /> Entry Logbook
        </Link>

        <Link to="/" className="menu-item logout">
          <FiLogOut className="menu-icon" /> Logout
        </Link>
      </div>
    </div>
  );
}