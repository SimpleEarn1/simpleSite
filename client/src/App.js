import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  // Приватный маршрут
  const PrivateRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div>
        <nav style={{ marginBottom: '20px' }}>
          {isLoggedIn ? (
            <>
              <Link to="/home">Главная</Link> |{' '}
              <Link to="/profile">Профиль</Link> |{' '}
              <Link to="/history">История</Link> |{' '}
              <Link to="/referrals">Рефералы</Link> |{' '}
              <button onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login">Вход</Link> |{' '}
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </nav>

        <Routes>
          {/* Публичные маршруты */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Главная страница по умолчанию */}
          <Route path="/" element={<PrivateRoute element={<Home />} />} />

          {/* Приватные маршруты */}
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/history" element={<PrivateRoute element={<History />} />} />
          <Route path="/referrals" element={<PrivateRoute element={<Referrals />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;