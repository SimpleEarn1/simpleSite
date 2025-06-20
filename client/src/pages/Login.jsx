import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // Состояния для email, пароля и ошибок
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Навигация для редиректа после входа
  const navigate = useNavigate();

  // Обработчик формы входа
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Отправляем POST запрос на backend
      const res = await fetch('/api/admin/login', { // замени на твой API путь
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        // Если ошибка, показываем сообщение
        setError(data.message || 'Ошибка входа');
        return;
      }

      // Успешный вход: сохраняем токен в localStorage
      localStorage.setItem('token', data.token);

      // Редиректим пользователя на защищённую страницу (например, профиль)
      navigate('/profile');
    } catch (err) {
      setError('Ошибка сервера');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2>Вход</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-100">Войти</button>
      </form>
    </div>
  );
}

export default Login;