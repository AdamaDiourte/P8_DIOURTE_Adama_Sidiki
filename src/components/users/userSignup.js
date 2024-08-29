// // SignupForm.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import '../../CSS/userSignup.css'; // Importer le fichier CSS
// const SignupForm = ({ onSignupSuccess }) => {
//   const [formData, setFormData] = useState({
//     nom: '',
//     prenom: '',
//     email: '',
//     motDePasse: '',
//     posteOccupe: ''
//   });
//   const [signupMessage, setSignupMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSignupMessage('');

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
//       setSignupMessage('Inscription réussie !');
//       console.log(response.data);
//       if (onSignupSuccess) onSignupSuccess(response.data);
//     } catch (error) {
//       setSignupMessage(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
//       console.error('Erreur d\'inscription:', error);
//     }
//   };

//   const renderInput = (name, label, type = 'text') => (
//     <div>
//       <label htmlFor={name}>{label}:</label>
//       <input
//         type={type}
//         id={name}
//         name={name}
//         value={formData[name]}
//         onChange={handleChange}
//         required
//       />
//     </div>
//   );

//   return (
//     <div className="signup-form">
//       <h2>Inscription</h2>
//       <form onSubmit={handleSubmit}>
//         {renderInput('nom', 'Nom')}
//         {renderInput('prenom', 'Prénom')}
//         {renderInput('email', 'Email', 'email')}
//         {renderInput('motDePasse', 'Mot de passe', 'password')}
//         {renderInput('posteOccupe', 'Poste occupé')}
//         <button type="submit">S'inscrire</button>
//       </form>
//       {signupMessage && <p className="message">{signupMessage}</p>}
//     </div>
//   );
// };

// export default SignupForm;


// // SignupForm.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import '../../CSS/userSignup.css'; // Importer le fichier CSS
// import UsersHomePageIcone from './usersHomePageIcone'; // Importez le composant UsersHomePageIcone

// const SignupForm = ({ onSignupSuccess }) => {
//   const [formData, setFormData] = useState({
//     nom: '',
//     prenom: '',
//     email: '',
//     motDePasse: '',
//     posteOccupe: ''
//   });
//   const [signupMessage, setSignupMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSignupMessage('');

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
//       setSignupMessage('Inscription réussie !');
//       console.log(response.data);
//       if (onSignupSuccess) onSignupSuccess(response.data);
//     } catch (error) {
//       setSignupMessage(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
//       console.error('Erreur d\'inscription:', error);
//     }
//   };

//   const renderInput = (name, label, type = 'text') => (
//     <div>
//       <label htmlFor={name}>{label}:</label>
//       <input
//         type={type}
//         id={name}
//         name={name}
//         value={formData[name]}
//         onChange={handleChange}
//         required
//       />
//     </div>
//   );

//   return (
//     <div className="signup-container">
//       <UsersHomePageIcone /> {/* Ajout de l'icône ici */}
//       <div className="signup-form">
//         <h2>Inscription</h2>
//         <form onSubmit={handleSubmit}>
//           {renderInput('nom', 'Nom')}
//           {renderInput('prenom', 'Prénom')}
//           {renderInput('email', 'Email', 'email')}
//           {renderInput('motDePasse', 'Mot de passe', 'password')}
//           {renderInput('posteOccupe', 'Poste occupé')}
//           <button type="submit">S'inscrire</button>
//         </form>
//         {signupMessage && <p className="message">{signupMessage}</p>}
//       </div>
//     </div>
//   );
// };

// export default SignupForm;




//+++++


// SignupForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/userSignup.css';
import UsersHomePageIcone from './usersHomePageIcone';

const SignupForm = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    posteOccupe: ''
  });
  const [signupMessage, setSignupMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      setSignupMessage('Inscription réussie !');
      console.log(response.data);
      if (onSignupSuccess) onSignupSuccess(response.data);
      
      // Redirection vers userHomePage après une inscription réussie
      navigate('/login');
    } catch (error) {
      setSignupMessage(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
      console.error('Erreur d\'inscription:', error);
      // En cas d'erreur, on reste sur la page d'inscription (pas de redirection)
    }
  };

  const renderInput = (name, label, type = 'text') => (
    <div>
      <label htmlFor={name}>{label}:</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
      />
    </div>
  );

  return (
    <div className="signup-container">
      <UsersHomePageIcone />
      <div className="signup-form">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit}>
          {renderInput('nom', 'Nom')}
          {renderInput('prenom', 'Prénom')}
          {renderInput('email', 'Email', 'email')}
          {renderInput('motDePasse', 'Mot de passe', 'password')}
          {renderInput('posteOccupe', 'Poste occupé')}
          <button type="submit">S'inscrire</button>
        </form>
        {signupMessage && <p className="message">{signupMessage}</p>}
      </div>
    </div>
  );
};

export default SignupForm;




//++++









// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // Importer useNavigate
// import '../../CSS/userSignup.css'; // Importer le fichier CSS
// import UsersHomePageIcone from './usersHomePageIcone'; // Import du composant de l'icône

// const SignupForm = () => {
//   const navigate = useNavigate(); // Initialiser useNavigate
//   const [formData, setFormData] = useState({
//     nom: '',
//     prenom: '',
//     email: '',
//     motDePasse: '',
//     posteOccupe: ''
//   });
//   const [signupMessage, setSignupMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSignupMessage('');

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
//       setSignupMessage('Inscription réussie !');
//       console.log(response.data);
//       navigate('/homepage'); // Rediriger vers la page HomePage en cas de succès
//     } catch (error) {
//       setSignupMessage(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
//       console.error('Erreur d\'inscription:', error);
//     }
//   };

//   const renderInput = (name, label, type = 'text') => (
//     <div>
//       <label htmlFor={name}>{label}:</label>
//       <input
//         type={type}
//         id={name}
//         name={name}
//         value={formData[name]}
//         onChange={handleChange}
//         required
//       />
//     </div>
//   );

//   return (
//     <div className="signup-form">
//       <UsersHomePageIcone /> {/* Ajout du composant de l'icône */}
//       <h2>Inscription</h2>
//       <form onSubmit={handleSubmit}>
//         {renderInput('nom', 'Nom')}
//         {renderInput('prenom', 'Prénom')}
//         {renderInput('email', 'Email', 'email')}
//         {renderInput('motDePasse', 'Mot de passe', 'password')}
//         {renderInput('posteOccupe', 'Poste occupé')}
//         <button type="submit">S'inscrire</button>
//       </form>
//       {signupMessage && <p className="message">{signupMessage}</p>}
//     </div>
//   );
// };

// export default SignupForm;
