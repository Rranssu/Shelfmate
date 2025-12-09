import { Routes, Route } from "react-router-dom";
import Home from './pages/home.jsx';
import Register from './pages/register.jsx';
import Dashborad from './pages/dashboard.jsx'
import Admin from './pages/admin.jsx'
import './App.css'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashborad />} />
      <Route path="/admin" element={<Admin />} />

    </Routes>
  );
}

export default App;

