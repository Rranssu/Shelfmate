import React from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiBook, FiUsers, FiLogOut, FiActivity } from "react-icons/fi";
import { FaRegAddressBook } from "react-icons/fa6";
import "./styles/adminSide.css";

export default function AdminSide({ onMenuClick }) {
  const nav = useNavigate();

  const handleMenuClick = (view) => {
    if (view === 'logout') {
      nav("/");
    } else {
      onMenuClick(view);
    }
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <img src="/logo.webp" alt="Logo" className="logo-image" />
        <h3 style={{ marginTop: "10px", fontWeight: "bold" }}>Admin Panel</h3>
      </div>

      <div className="sidebar-menu">
        <button className="menu-item active" onClick={() => handleMenuClick("dashboard")}>
          <FiHome className="menu-icon" /> Dashboard
        </button>

        <button className="menu-item" onClick={() => handleMenuClick("users")}>
          <FiUsers className="menu-icon" /> Users
        </button>

        <button className="menu-item" onClick={() => handleMenuClick("inventory")}>
          <FiBook className="menu-icon" /> Inventory
        </button>

        <button className="menu-item" onClick={() => handleMenuClick("entry-logbook")}>
          <FaRegAddressBook className="menu-icon" /> Entry Logbook
        </button>

        <button
          className="menu-item logout"
          onClick={() => handleMenuClick("logout")}
        >
          <FiLogOut className="menu-icon" /> Logout
        </button>
      </div>
    </div>
  );
}
