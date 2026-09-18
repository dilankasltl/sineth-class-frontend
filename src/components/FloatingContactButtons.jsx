import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingContactButtons() {
  const phoneNumber = '+94713126258';
  const whatsappUrl = `https://wa.me/94713126258?text=${encodeURIComponent('Hi! I am reaching out regarding MathiQ Higher Educational Institute.')}`;
  const callUrl = `tel:${phoneNumber}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        zIndex: 9999
      }}
    >
      {/* Phone Call Floating Button */}
      <a
        href={callUrl}
        className="floating-call-btn"
        title="Call Helpline (+94713126258)"
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          cursor: 'pointer',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        <Phone size={24} />
      </a>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp-btn"
        title="Chat on WhatsApp (+94713126258)"
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          cursor: 'pointer',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
