import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome } from '@fortawesome/free-solid-svg-icons';
import '../../CSS/errorPage.css';

function ErrorPage() {
  return (
    <div className="error-page">
      <div className="error-content">
        <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
        <h1>Oops! Une erreur s'est produite</h1>
        <p>Nous sommes désolés, mais quelque chose s'est mal passé.</p>
        <Link to="/postsPage" className="home-button">
          <FontAwesomeIcon icon={faHome} /> Retour à la page d'accueil
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;