// UsersHomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/usersHomePage.css'; // Assurez-vous de créer ce fichier CSS

const UsersHomePage = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="users-home-container">
      <h1>Bienvenue sur le réseau social de Groupomania</h1>
      <div className="button-container">
        <button className="users-home-button signup" onClick={handleSignupClick}>
          S'inscrire
        </button>
        <button className="users-home-button login" onClick={handleLoginClick}>
          Se connecter
        </button>
      </div>
    </div>
  );
};

export default UsersHomePage;