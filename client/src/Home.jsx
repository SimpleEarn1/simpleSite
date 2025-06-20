import React from 'react';

export default function Home() {
  return (
    <div style={{
      backgroundColor: '#fff',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        padding: '40px 30px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgb(0 0 0 / 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{color: '#0d6efd', marginBottom: '30px', fontWeight: 700, fontSize: '2.5rem'}}>
          SimpleEarn
        </h1>

        <a href="/register" className="btn btn-primary mb-3 w-100" style={{fontWeight: 600, fontSize: '1.1rem', borderRadius: '8px', padding: '12px 24px'}}>
          Регистрация
        </a>
        <a href="/login" className="btn btn-outline-primary w-100" style={{fontWeight: 600, fontSize: '1.1rem', borderRadius: '8px', padding: '12px 24px'}}>
          Вход
        </a>
      </div>
    </div>
  );
}