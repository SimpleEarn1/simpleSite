import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserHistoryModal from './UserHistoryModal.jsx';

function AdminPanel({ token, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null); // Модалка истории

  useEffect(() => {
    axios.get('http://localhost:3000/admin/users', {
      headers: {
        Authorization: 'Bearer ${token}'
      }
    })
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки пользователей:', err);
        setLoading(false);
      });
  }, [token]);

  const updateBalance = (userId, newBalance) => {
    axios.post(`http://localhost:3000/admin/users/${userId}/balance`, {
      amount: newBalance
    }, {
      headers: {
        Authorization: 'Bearer ${token}'
      }
    }).then(() => {
      alert('Баланс обновлён');
      setUsers(users.map(u => u._id === userId ? { ...u, balance: newBalance } : u));
    }).catch(err => {
      console.error(err);
      alert('Ошибка при обновлении баланса');
    });
  };

  const toggleBlock = (userId, isBlocked) => {
    axios.post(`http://localhost:3000/admin/users/${userId}/block`, {
      block: !isBlocked
    }, {
      headers: {
        Authorization: 'Bearer ${token}'
      }
    }).then(() => {
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !isBlocked } : u));
    }).catch(err => {
      console.error(err);
      alert('Ошибка при блокировке/разблокировке');
    });
  };

  const deleteUser = (userId) => {
    if (!window.confirm('Удалить пользователя?')) return;

    axios.delete(`http://localhost:3000/admin/users/${userId}`, {
      headers: {
        Authorization: 'Bearer ${token}'
      }
    }).then(() => {
      setUsers(users.filter(u => u._id !== userId));
    }).catch(err => {
      console.error(err);
      alert('Ошибка при удалении');
    });
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Админ-панель</h2>
      <button onClick={onLogout}>Выйти</button>

      <div style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Поиск по email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          style={{ padding: 8, width: 300, marginRight: 10 }}
        />
        <button onClick={() => setSortAsc(!sortAsc)}>
          Сортировать по балансу: {sortAsc ? '↑' : '↓'}
        </button>
      </div>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Email</th>
            <th>Баланс</th>
            <th>Заблокирован</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(user => user.email.toLowerCase().includes(searchEmail.toLowerCase()))
            .sort((a, b) => sortAsc ? a.balance - b.balance : b.balance - a.balance)
            .map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={user.balance}
                    onBlur={(e) => updateBalance(user._id, parseFloat(e.target.value))}
                  />
                </td>
                <td>{user.isBlocked ? 'Да' : 'Нет'}</td>
                <td>
                  <button onClick={() => toggleBlock(user._id, user.isBlocked)}>
                    {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                  </button>
                  <button onClick={() => deleteUser(user._id)}>Удалить</button>
                  <button onClick={() => setSelectedUserId(user._id)}>История</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

       {selectedUserId && (
        <UserHistoryModal
        userId={selectedUserId}
          token={token}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}

export default AdminPanel;