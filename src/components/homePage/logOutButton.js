import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/logOutButton.css'; // Importer le fichier CSS

function LogOutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Effectuer ici toutes les opérations nécessaires pour la déconnexion
    // Par exemple, supprimer le token du localStorage
    localStorage.removeItem('token');

    // Vous pouvez également appeler une API de déconnexion si nécessaire
    // Exemple : 
    // async function logoutAPI() {
    //   try {
    //     await axios.post('/api/logout');
    //   } catch (error) {
    //     console.error('Erreur lors de la déconnexion:', error);
    //   }
    // }
    // logoutAPI();

    // Rediriger vers la page de connexion après un court délai
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 3000); // 3 secondes de délai

    // Nettoyer le timer si le composant est démonté
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="logout-page">
      <h1>Déconnexion en cours...</h1>
      <p>Vous avez été déconnecté avec succès.</p>
      <p>Vous allez être redirigé vers la page de connexion dans quelques secondes.</p>
    </div>
  );
}

export default LogOutPage;