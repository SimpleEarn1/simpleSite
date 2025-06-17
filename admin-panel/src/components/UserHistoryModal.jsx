import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserHistoryModal({ userId, token, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/admin/users/${userId}/history`, {
      headers: { Authorization: 'Bearer ${token}' }
    })
    .then(res => {
      setHistory(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Ошибка загрузки истории:', err);
      setLoading(false);
    });
  }, [userId, token]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ background: '#fff', padding: 20, width: 400, maxHeight: 500, overflowY: 'auto' }}>
        <h3>История пользователя</h3>
        <button onClick={onClose}>Закрыть</button>

        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <ul>
            {history.map((item, idx) => (
              <li key={idx}>
                <b>{item.type}</b>: {item.amount} — {new Date(item.date).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserHistoryModal;