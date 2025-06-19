import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверяем, есть ли токен при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // если токен есть — true, иначе false
  }, []);

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem('token'); // удаляем токен
    setIsLoggedIn(false); // обновляем состояние
    window.location.href = '/login'; // перенаправляем пользователя на вход
  };

  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/">Главная</Link> |{' '}
        <Link to="/register">Регистрация</Link> |{' '}
        <Link to="/login">Вход</Link>

        {/* Если пользователь залогинен — показываем кнопку "Выйти" */}
        {isLoggedIn && (
          <>
            {' '}| <button onClick={handleLogout}>Выйти</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;