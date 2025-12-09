import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiBook, FiUsers, FiLogOut, FiActivity } from "react-icons/fi";
import "./styles/admin.css";
import AdminDashboard from "../components/AdminDashboard";
import { UserContext } from "../context/userContext"; // temporary context

export default function AdminPage() {
  const { sessions, borrows, logout } = useContext(UserContext);
  const nav = useNavigate();

  return (
    <div className="admin" style={{ display: "flex" }}>
      {/* ---------------------- SIDEBAR ---------------------- */}
      <div className="admin-sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" className="logo-image" />
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
          <button className="menu-item">
            <FiActivity className="menu-icon" /> Activity Logs
          </button>
          <button
            className="menu-item logout"
            onClick={() => {
              logout();
              nav("/");
            }}
          >
            <FiLogOut className="menu-icon" /> Logout
          </button>
        </div>
      </div>

      {/* ---------------------- MAIN CONTENT ---------------------- */}
      <AdminDashboard />
      </div>

  );
}
