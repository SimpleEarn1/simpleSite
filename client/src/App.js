import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import History from './pages/History';
import Referrals from './pages/Referrals';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверка токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // true если токен есть
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div>
        <nav style={{ marginBottom: '20px' }}>
          {isLoggedIn ? (
            <>
              <Link to="/home">🏠 Главная</Link> |{' '}
              <Link to="/profile">👤 Профиль</Link> |{' '}
              <Link to="/history">📜 История</Link> |{' '}
              <Link to="/referrals">👥 Рефералы</Link> |{' '}
              <button onClick={handleLogout}>🚪 Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login">Вход</Link> |{' '}
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/referrals" element={<Referrals />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;