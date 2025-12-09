// src/pages/admin.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSide from "../components/adminSide";
import AdminDashboard from "../components/adminDashboard";
import EntryLogbook from "../components/entryLogbook";
import "./styles/admin.css";

export default function AdminPage() {
  return (
    <div className="admin" style={{ display: "flex" }}>
      {/* ---------------------- SIDEBAR ---------------------- */}
      <AdminSide />

      {/* ---------------------- MAIN CONTENT ---------------------- */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="logbook" element={<EntryLogbook />} />
          {/* You can add more routes here for Students, Books, etc */}
        </Routes>
      </div>
    </div>
  );
}
