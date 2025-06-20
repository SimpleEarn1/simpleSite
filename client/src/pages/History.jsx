import React, { useEffect, useState } from 'react';

function History() {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/balance/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setHistory(data));
  }, [token]);

  return (
    <div>
      <h2>📜 История операций</h2>
      {history.length === 0 ? (
        <p>Нет операций</p>
      ) : (
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              {item.type === 'deposit' ? 'Пополнение' : 'Снятие'}: ${item.amount.toFixed(2)} — {new Date(item.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;