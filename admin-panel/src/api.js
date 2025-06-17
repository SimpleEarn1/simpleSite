import React, { useState } from 'react';

function App() {
  const [page, setPage] = useState('login');

  if (page === 'login') {
    return (
      <div>
        <h1>Login Page</h1>
        <button onClick={() => setPage('admin')}>Войти как админ</button>
      </div>
    );
  }

  if (page === 'admin') {
    return (
      <div>
        <h1>Admin Panel</h1>
        <button onClick={() => setPage('login')}>Выйти</button>
      </div>
    );
  }

  return null;
}

export default App;