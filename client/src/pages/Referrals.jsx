import React, { useEffect, useState } from 'react';

function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [userId, setUserId] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUserId(data._id));

    fetch('/api/team/referrals', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setReferrals(data));
  }, [token]);

  const referralLink = `${window.location.origin}/register?ref=${userId}`;

  return (
    <div>
      <h2>👥 Моя команда</h2>
      <p><strong>Реферальная ссылка:</strong><br />
        <code>{referralLink}</code>
      </p>
      {referrals.length === 0 ? (
        <p>У вас пока нет приглашённых пользователей.</p>
      ) : (
        <ul>
          {referrals.map((r, i) => (
            <li key={i}>
              {r.email} – зарегистрирован: {new Date(r.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Referrals;