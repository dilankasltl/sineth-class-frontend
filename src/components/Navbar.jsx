import React from 'react';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="glass-card" style={{ borderRadius: '0 0 16px 16px', marginBottom: '2rem', padding: '1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* MathiQ Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            padding: '0.6rem 0.8rem',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.45)'
          }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em' }}>MQ</span>
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MathiQ
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Higher Educational Institute
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <div style={{ background: user.role === 'admin' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(99, 102, 241, 0.2)', padding: '0.4rem', borderRadius: '8px' }}>
                {user.role === 'admin' ? <Shield size={18} color="#ec4899" /> : <UserIcon size={18} color="#6366f1" />}
              </div>
              <div style={{ textTransform: 'capitalize' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span>{user.role === 'admin' ? 'System Administrator' : `Student ID: ${user.studentId}`}</span>
                  {user.alYear && <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{user.alYear} A/L</span>}
                </div>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              title="Sign Out"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
