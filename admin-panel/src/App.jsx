import React, { useState } from 'react';
import LoginPage from './components/LoginPage.jsx';
import AdminPanel from './components/AdminPanel.jsx';

function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (jwtToken) => {
    setToken(jwtToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <>
      {!token ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <AdminPanel token={token} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;