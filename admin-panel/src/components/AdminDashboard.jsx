// src/components/AdminDashboard.jsx
import React from 'react';

function AdminDashboard({ token, onLogout }) {
  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Админ-панель</h2>
      <p>Ваш токен: <code>{token}</code></p>
      <button onClick={onLogout} style={{ padding: 10, marginTop: 20 }}>
        Выйти
      </button>
    </div>
  );
}

export default AdminDashboard;