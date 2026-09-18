import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';

import FloatingContactButtons from './components/FloatingContactButtons';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('tuition_user');
    const token = localStorage.getItem('tuition_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('tuition_user');
        localStorage.removeItem('tuition_token');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('tuition_token');
    localStorage.removeItem('tuition_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
        Loading tuition portal...
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />

      <main>
        {!user ? (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        ) : user.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <StudentDashboard user={user} />
        )}
      </main>

      {/* Floating WhatsApp & Call Buttons (Only when logged in) */}
      {user && <FloatingContactButtons />}
    </div>
  );
}
