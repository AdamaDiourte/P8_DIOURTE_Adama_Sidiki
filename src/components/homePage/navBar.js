import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../CSS/navBar.css';
import { FaSignOutAlt } from 'react-icons/fa'; // Importer une icône de déconnexion

function NavBar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/logOutPage');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav className={`navbar ${menuOpen ? 'active' : ''}`}>
        <div className="burger-menu" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="navbar-links">
          <Link to="/profilPage">Profil</Link>
          <Link to="/postsPage">Tous les Posts</Link>
          <Link to="/create-post">Nouveau Post</Link>
        </div>
        <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
        <button onClick={handleLogout} className="logout-button">Déconnexion</button>
      </nav>
      
    </>
  );
}

export default NavBar;
