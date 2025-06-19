import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Если токена нет, перенаправляем на /login
      navigate('/login');
      return;
    }

    fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Не авторизован');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => {
        console.error(err.message);
        // Если ошибка — отправляем на login
        navigate('/login');
      });
  }, [navigate]);

  if (!profile) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Добро пожаловать, {profile.name}</h1>
      <p>Баланс: ${profile.balance}</p>

      <h3>История операций:</h3>
      <ul>
        {profile.transactions?.map((tx, index) => (
          <li key={index}>
            {tx.type === 'deposit' ? 'Пополнение' : 'Снятие'} — ${tx.amount} ({tx.date})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;