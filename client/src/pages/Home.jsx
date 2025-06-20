import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [profile, setProfile] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Получение профиля
  const fetchProfile = () => {
    fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Не авторизован');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => {
        console.error(err.message);
        navigate('/login');
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate, token]);

  // Пополнение
  const handleDeposit = () => {
    fetch('/api/balance/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: Number(amount) }),
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || '✅ Пополнение успешно!');
        setAmount('');
        fetchProfile();
      })
      .catch(() => setMessage('❌ Ошибка при пополнении'));
  };

  // Снятие
  const handleWithdraw = () => {
    fetch('/api/balance/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: Number(amount) }),
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || '✅ Снятие успешно!');
        setAmount('');
        fetchProfile();
      })
      .catch(() => setMessage('❌ Ошибка при снятии'));
  };

  if (!profile) return <div>⏳ Загрузка...</div>;

  return (
    <div>
      <h1>👋 Добро пожаловать, {profile.name || profile.email}</h1>
      <p><strong>💰 Баланс:</strong> ${profile.balance.toFixed(2)}</p>

      <h3>➕ Пополнение / ➖ Снятие</h3>
      <input
        type="number"
        value={amount}
        placeholder="Введите сумму"
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />
      <button onClick={handleDeposit}>💰 Пополнить</button>{' '}
      <button onClick={handleWithdraw}>💸 Снять</button>

      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}

      <h3>📜 История операций</h3>
      <ul>
        {profile.transactions?.length > 0 ? (
          profile.transactions.map((tx, index) => (
            <li key={index}>
              {tx.type === 'deposit' ? '➕ Пополнение' : '➖ Снятие'} — ${tx.amount} (
              {new Date(tx.date).toLocaleString()})
            </li>
          ))
        ) : (
          <li>Нет операций</li>
        )}
      </ul>
    </div>
  );
}

export default Home;