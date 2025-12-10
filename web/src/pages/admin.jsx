import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AdminSide from "../components/adminSide";
import AdminDashboard from "../components/adminDashboard";
import AdminUsers from "../components/adminUsers";
import AdminInventory from "../components/adminInventory";
import EntryLogbook from "../components/entryLogbook";
import "./styles/admin.css";

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { libraryUid, libraryName } = location.state || {};

  useEffect(() => {
    if (!libraryUid) {
      navigate("/");
    }
  }, [libraryUid, navigate]);

  if (!libraryUid) return null;

  return (
    <div className="admin" style={{ display: "flex" }}>
      <AdminSide libraryUid={libraryUid} libraryName={libraryName} />

      <div style={{ flex: 1, padding: "20px", overflowY: "auto", height: "100vh" }}>
        <Routes>
          <Route path="/" element={<AdminDashboard libraryUid={libraryUid} />} />
          <Route path="users" element={<AdminUsers libraryUid={libraryUid} />} />
          <Route path="inventory" element={<AdminInventory libraryUid={libraryUid} />} />
          <Route path="logbook" element={<EntryLogbook libraryUid={libraryUid} />} />
        </Routes>
      </div>
    </div>
  );
}