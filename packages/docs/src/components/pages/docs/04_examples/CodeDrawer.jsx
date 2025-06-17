import { useState } from 'react';

export default function CodeDrawer({ code, title = "전체 코드 보기" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      marginTop: '1rem',
      border: '1px solid #374151',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      backgroundColor: 'rgba(31, 41, 55, 0.5)'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          color: '#d1d5db'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{title}</span>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          style={{
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: '#9ca3af'
          }}
        >
          <path 
            d="M5 7L10 12L15 7" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div style={{ borderTop: '1px solid #374151' }}>
          <div style={{ overflowX: 'auto' }}>
            <pre style={{ 
              padding: '1rem', 
              margin: 0,
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: '#e5e7eb',
              backgroundColor: 'rgba(17, 24, 39, 0.5)'
            }}>
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}