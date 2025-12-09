import React from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiBook, FiUsers, FiLogOut, FiActivity } from "react-icons/fi";
import "./styles/adminSide.css";

export default function AdminSide() {
  const nav = useNavigate();

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <img src="/logo.webp" alt="Logo" className="logo-image" />
        <h3 style={{ marginTop: "10px", fontWeight: "bold" }}>Admin Panel</h3>
      </div>

      <div className="sidebar-menu">
        <button className="menu-item active" onClick={() => nav("/admin")}>
          <FiHome className="menu-icon" /> Dashboard
        </button>

        <button className="menu-item">
          <FiUsers className="menu-icon" /> Students
        </button>

        <button className="menu-item">
          <FiBook className="menu-icon" /> Books
        </button>

        <button className="menu-item" onClick={() => nav("/admin/logbook")}>
            <FiActivity className="menu-icon" /> Entry Logbook
          </button>


        <button
          className="menu-item logout" 
          onClick={() => nav("/")}
        >
          <FiLogOut className="menu-icon" /> Logout
        </button>
      </div>
    </div>
  );
}