import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import PendaftaranPage from './pages/PendaftaranPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Registration Page */}
        <Route path="/daftar" element={<PendaftaranPage />} />
        
        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Panel Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
