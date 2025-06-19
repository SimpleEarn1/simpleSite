import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Сохраняем токен в localStorage или в состоянии
        localStorage.setItem('token', data.token);
        setMessage('Вход выполнен');
        // Можно перенаправить пользователя, например, на главную
        window.location.href = '/';
      } else {
        setMessage(data.message || 'Ошибка входа');
      }
    } catch (err) {
      setMessage('Ошибка сети');
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Войти</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;