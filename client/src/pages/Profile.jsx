import React, { useEffect, useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setProfile(data));
  }, [token]);

  if (!profile) return <p>Загрузка...</p>;

  return (
    <div>
      <h2>👤 Мой профиль</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Баланс:</strong> ${profile.balance.toFixed(2)}</p>
    </div>
  );
}

export default Profile;