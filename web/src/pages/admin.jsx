import React from "react";
import AdminSide from "../components/adminSide"; // Import the new sidebar component
import AdminDashboard from "../components/adminDashboard";
import "./styles/admin.css";

export default function AdminPage() {
  return (
    <div className="admin" style={{ display: "flex" }}>
      {/* ---------------------- SIDEBAR ---------------------- */}
      <AdminSide />

      {/* ---------------------- MAIN CONTENT ---------------------- */}
      <AdminDashboard />
    </div>
  );
}