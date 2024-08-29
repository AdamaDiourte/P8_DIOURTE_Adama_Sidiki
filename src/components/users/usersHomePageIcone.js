// UsersHomePageIcone.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UsersHomePageIcone = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');  // Redirige vers la page usersHomePage
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#FFC0CB"/>
        <path d="M20 10 A10 10 0 1 0 20 30 A10 10 0 1 0 20 10 Z M13 20 L27 20 M20 13 L20 27" stroke="white" strokeWidth="2"/>
      </svg>
    </div>
  );
};

export default UsersHomePageIcone;