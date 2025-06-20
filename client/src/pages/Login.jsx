import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Функция вызывается при отправке формы (нажатии кнопки "Войти")
  const handleSubmit = async (e) => {
    e.preventDefault();  // Останавливаем стандартное поведение формы
    setMessage('');      // Сбрасываем сообщение

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token); // Сохраняем токен
        setMessage('Вход выполнен');
        window.location.href = '/'; // Перенаправляем на главную страницу
      } else {
        setMessage(data.message || 'Ошибка входа');
      }
    } catch (error) {
      setMessage('Ошибка сети');
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <br />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <br />
        <button type="submit">Войти</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;