import React from 'react';

export default function LoadingFallback({ message = 'Đang tải nội dung...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      width: '100%',
      gap: '16px',
      color: '#94a3b8'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(28, 105, 212, 0.15)',
        borderTop: '3px solid #1c69d4',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.02em' }}>
        {message}
      </span>
    </div>
  );
}
