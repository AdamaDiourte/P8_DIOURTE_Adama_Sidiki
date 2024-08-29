// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import '../../CSS/userLogin.css';
// // import UsersHomePageIcone from './usersHomePageIcone';

// // const Login = ({ onLoginSuccess }) => {
// //   const [email, setEmail] = useState('');
// //   const [motDePasse, setMotDePasse] = useState('');
// //   const [message, setMessage] = useState('');
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setMessage('');

// //     try {
// //       const response = await axios.post('http://localhost:5000/api/auth/login', {
// //         email,
// //         motDePasse
// //       });

// //       console.log('Réponse du serveur:', response.data);

// //       // Stockage du token dans le localStorage
// //       localStorage.setItem('token', response.data.token);
      
// //       // Stockage de l'ID de l'utilisateur dans le localStorage
// //       localStorage.setItem('userId', response.data.user.id.toString());
      
// //       // Stockage du rôle de l'utilisateur dans le localStorage (si disponible)
// //       if (response.data.user.role) {
// //         localStorage.setItem('userRole', response.data.user.role);
// //       }
      
// //       setMessage('Connexion réussie !');
      
// //       // Appeler la fonction onLoginSuccess passée en props
// //       onLoginSuccess(response.data.user);

// //       // Rediriger vers la page homePage en cas de connexion réussie
// //       navigate('/home');
// //     } catch (error) {
// //       console.error('Erreur de connexion:', error.response?.data || error.message);
// //       setMessage(error.response?.data?.message || "Une erreur est survenue lors de la connexion");
// //       // On reste sur la page de connexion en cas d'erreur (pas de redirection)
// //     }
// //   };

// //   return (
// //     <div className="login-container">
// //       <UsersHomePageIcone />
// //       <div className="login-form">
// //         <h2>Page de connexion</h2>
// //         <form onSubmit={handleSubmit}>
// //           <div className="form-group">
// //             <label htmlFor="email">Email :</label>
// //             <input
// //               type="email"
// //               id="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               required
// //             />
// //           </div>
// //           <div className="form-group">
// //             <label htmlFor="motDePasse">Mot de passe :</label>
// //             <input
// //               type="password"
// //               id="motDePasse"
// //               value={motDePasse}
// //               onChange={(e) => setMotDePasse(e.target.value)}
// //               required
// //             />
// //           </div>
// //           <button type="submit" className="login-button">Se connecter</button>
// //         </form>
// //         {message && <p className={`message ${message.includes('réussie') ? 'success' : 'error'}`}>{message}</p>}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../services/api'; // Assurez-vous que le chemin est correct
// import '../../CSS/userLogin.css';
// import UsersHomePageIcone from './usersHomePageIcone';

// const Login = ({ onLoginSuccess }) => {
//   const [email, setEmail] = useState('');
//   const [motDePasse, setMotDePasse] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     try {
//       const response = await api.post('/auth/login', {
//         email,
//         motDePasse
//       });

//       console.log('Réponse du serveur:', response.data);

//       // Stockage des tokens dans le localStorage
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('refreshToken', response.data.refreshToken);
      
//       // Stockage de l'ID de l'utilisateur dans le localStorage
//       localStorage.setItem('userId', response.data.user.id.toString());
      
//       // Stockage du rôle de l'utilisateur dans le localStorage (si disponible)
//       if (response.data.user.role) {
//         localStorage.setItem('userRole', response.data.user.role);
//       }
      
//       setMessage('Connexion réussie !');
      
//       // Appeler la fonction onLoginSuccess passée en props
//       onLoginSuccess(response.data.user);

//       // Rediriger vers la page homePage en cas de connexion réussie
//       navigate('/home');
//     } catch (error) {
//       console.error('Erreur de connexion:', error.response?.data || error.message);
//       setMessage(error.response?.data?.message || "Une erreur est survenue lors de la connexion");
//       // On reste sur la page de connexion en cas d'erreur (pas de redirection)
//     }
//   };

//   return (
//     <div className="login-container">
//       <UsersHomePageIcone />
//       <div className="login-form">
//         <h2>Page de connexion</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email :</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="motDePasse">Mot de passe :</label>
//             <input
//               type="password"
//               id="motDePasse"
//               value={motDePasse}
//               onChange={(e) => setMotDePasse(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="login-button">Se connecter</button>
//         </form>
//         {message && <p className={`message ${message.includes('réussie') ? 'success' : 'error'}`}>{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/userLogin.css';
import UsersHomePageIcone from './usersHomePageIcone';
import { AuthContext } from './authContext'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        motDePasse
      });

      console.log('Réponse du serveur:', response.data);

      // Utilisation de la fonction login du contexte
      login(response.data);

      setMessage('Connexion réussie !');

      // Rediriger vers la page homePage en cas de connexion réussie
      navigate('/home');
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Une erreur est survenue lors de la connexion");
    }
  };

  return (
    <div className="login-container">
      <UsersHomePageIcone />
      <div className="login-form">
        <h2>Page de connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="motDePasse">Mot de passe :</label>
            <input
              type="password"
              id="motDePasse"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Se connecter</button>
        </form>
        {message && <p className={`message ${message.includes('réussie') ? 'success' : 'error'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;