import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"; // Import hooks
import AdminSide from "../components/adminSide";
import AdminDashboard from "../components/adminDashboard";
import AdminUsers from "../components/adminUsers";
import AdminInventory from "../components/adminInventory";
import EntryLogbook from "../components/entryLogbook";
import "./styles/admin.css";

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Retrieve the UID and Name passed from the Dashboard Navbar
  const { libraryUid, libraryName } = location.state || {};

  // 2. Security: If someone types /admin manually without logging in, kick them out
  useEffect(() => {
    if (!libraryUid) {
      navigate("/");
    }
  }, [libraryUid, navigate]);

  if (!libraryUid) return null;

  return (
    <div className="admin" style={{ display: "flex" }}>
      {/* 3. Pass libraryUid to the Sidebar so links can preserve it */}
      <AdminSide libraryUid={libraryUid} libraryName={libraryName} />

      <div style={{ flex: 1, padding: "20px", overflowY: "auto", height: "100vh" }}>
        <Routes>
          {/* 4. Pass libraryUid to ALL sub-components */}
          <Route path="/" element={<AdminDashboard libraryUid={libraryUid} />} />
          <Route path="users" element={<AdminUsers libraryUid={libraryUid} />} />
          <Route path="inventory" element={<AdminInventory libraryUid={libraryUid} />} />
          <Route path="logbook" element={<EntryLogbook libraryUid={libraryUid} />} />
        </Routes>
      </div>
    </div>
  );
}