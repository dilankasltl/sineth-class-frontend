import React, { useState } from 'react';
import API from '../api';
import { User, Shield, UserPlus, LogIn, Lock, CreditCard, CalendarDays, Sparkles, AlertCircle, CheckCircle2, Building2 } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('student-login'); // 'student-login', 'admin-login', 'register'

  // Form states
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regIdNumber, setRegIdNumber] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regAlYear, setRegAlYear] = useState('2028');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await API.post('/auth/login', {
        loginId: loginId.trim(),
        password: password.trim()
      });

      localStorage.setItem('tuition_token', res.data.token);
      localStorage.setItem('tuition_user', JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await API.post('/auth/register', {
        firstName: regFirstName,
        lastName: regLastName,
        idNumber: regIdNumber,
        school: regSchool,
        alYear: regAlYear
      });

      setSuccessMsg(`Registration successful! Your Student ID is ${res.data.student.studentId}. Auto-logging in...`);
      setTimeout(() => {
        localStorage.setItem('tuition_token', res.data.token);
        localStorage.setItem('tuition_user', JSON.stringify(res.data.student));
        onLoginSuccess(res.data.student);
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem 2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '0.8rem 1.4rem', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.25))',
            border: '1px solid var(--border-glass)',
            marginBottom: '1rem' 
          }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#818cf8', letterSpacing: '-0.02em' }}>MathiQ</span>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.3rem', background: 'linear-gradient(90deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Combined Mathematics
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Select your account type to proceed
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '0.3rem', 
          background: 'rgba(15, 23, 42, 0.7)', 
          padding: '0.3rem', 
          borderRadius: '12px',
          border: '1px solid var(--border-glass)',
          marginBottom: '1.8rem'
        }}>
          <button
            onClick={() => { setActiveTab('student-login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '0.55rem 0.4rem',
              borderRadius: '9px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              background: activeTab === 'student-login' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'student-login' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <User size={14} />
            <span>Student</span>
          </button>

          <button
            onClick={() => { setActiveTab('admin-login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '0.55rem 0.4rem',
              borderRadius: '9px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              background: activeTab === 'admin-login' ? '#ec4899' : 'transparent',
              color: activeTab === 'admin-login' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <Shield size={14} />
            <span>Admin</span>
          </button>

          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '0.55rem 0.4rem',
              borderRadius: '9px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              background: activeTab === 'register' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'register' ? '#000000' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={14} />
            <span>Register</span>
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM 1: STUDENT LOGIN */}
        {activeTab === 'student-login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Student ID (e.g. 20280001)
              </label>
              <input
                type="text"
                required
                placeholder="Enter Student ID"
                className="glass-input"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Password (Your NIC / ID Number)
              </label>
              <input
                type="password"
                required
                placeholder="Enter your ID Number"
                className="glass-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
              {loading ? 'Authenticating...' : <><LogIn size={18} /> Student Sign In</>}
            </button>
          </form>
        )}

        {/* FORM 2: ADMIN LOGIN */}
        {activeTab === 'admin-login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Admin Username
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                className="glass-input"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Admin Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="glass-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem', width: '100%', background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
              {loading ? 'Authenticating...' : <><Shield size={18} /> Admin Sign In</>}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              Default Admin: <strong></strong> | Password: <strong></strong>
            </div>
          </form>
        )}

        {/* FORM 3: STUDENT REGISTRATION */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nimal"
                  className="glass-input"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Perera"
                  className="glass-input"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                ID Number (NIC / Student ID Card No)
              </label>
              <input
                type="text"
                required
                placeholder="200412345678"
                className="glass-input"
                value={regIdNumber}
                onChange={(e) => setRegIdNumber(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                School Name
              </label>
              <input
                type="text"
                placeholder="e.g. Royal College / Ananda College / Visakha"
                className="glass-input"
                value={regSchool}
                onChange={(e) => setRegSchool(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                A/L Exam Year
              </label>
              <select
                className="glass-input"
                value={regAlYear}
                onChange={(e) => setRegAlYear(e.target.value)}
              >
                <option value="2025">2025 A/L Batch</option>
                <option value="2026">2026 A/L Batch</option>
                <option value="2027">2027 A/L Batch</option>
                <option value="2028">2028 A/L Batch</option>
                <option value="2029">2029 A/L Batch</option>
              </select>
            </div>

            {/* Student ID Live Auto Generation Preview */}
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '0.75rem', borderRadius: '10px', fontSize: '0.8rem', color: '#67e8f9', textAlign: 'center' }}>
              🤖 <strong>Auto Student ID Preview:</strong> {regAlYear}XXXX (Format: {regAlYear}0001)
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#000000', fontWeight: 800 }}>
              {loading ? 'Creating Account...' : <><UserPlus size={18} /> Register Student</>}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
