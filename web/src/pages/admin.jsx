// src/pages/admin.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSide from "../components/adminSide";
import AdminDashboard from "../components/adminDashboard";
import AdminUsers from "../components/adminUsers";
import AdminInventory from "../components/adminInventory";
import EntryLogbook from "../components/entryLogbook";
import "./styles/admin.css";

export default function AdminPage() {
  return (
    <div className="admin" style={{ display: "flex" }}>
      <AdminSide />

      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="logbook" element={<EntryLogbook />} />
        </Routes>
      </div>
    </div>
  );
}