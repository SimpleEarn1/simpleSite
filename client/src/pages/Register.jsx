import React, { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Регистрация успешна!');
      } else {
        setMessage(data.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setMessage('Ошибка сети');
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Register;