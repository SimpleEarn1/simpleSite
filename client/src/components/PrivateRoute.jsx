import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  // Получаем токен из localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    // Если токена нет, перекидываем на страницу входа
    return <Navigate to="/login" replace />;
  }

  // Если токен есть — показываем содержимое
  return children;
}

export default PrivateRoute;