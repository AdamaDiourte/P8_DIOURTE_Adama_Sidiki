// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import '../../CSS/profilPage.css';

// function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updateMessage, setUpdateMessage] = useState('');

//   const [formData, setFormData] = useState({
//     sexe: '',
//     age: '',
//     posteOccupe: '',
//     photoProfil: null
//   });

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("Token:", token); // Debugging line
//       if (!token) {
//         throw new Error("Token manquant");
//       }

//       const response = await axios.get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUser(response.data);
//       setFormData({
//         sexe: response.data.sexe || '',
//         age: response.data.age || '',
//         posteOccupe: response.data.posteOccupe || '',
//         photoProfil: response.data.photoProfil || null
//       });
//       setLoading(false);
//     } catch (err) {
//       setError("Erreur lors de la récupération du profil");
//       setLoading(false);
//       console.error("Erreur détaillée:", err);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const handlePhotoUpdate = useCallback(async () => {
//     setUpdateMessage('');

//     try {
//       const token = localStorage.getItem("token");
//       const formDataToSend = new FormData();
//       if (formData.photoProfil) {
//         formDataToSend.append("photoProfil", formData.photoProfil);
//       } else {
//         setUpdateMessage("Veuillez sélectionner une photo à télécharger.");
//         return;
//       }

//       const response = await axios.put("http://localhost:5000/api/auth/me/photo", formDataToSend, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       setUpdateMessage(response.data.message);
//       fetchUserProfile(); // Re-fetch user profile to get updated data
//     } catch (err) {
//       setUpdateMessage("Erreur lors de la mise à jour de la photo de profil");
//       console.error("Erreur détaillée:", err);
//     }
//   }, [formData.photoProfil]);

//   useEffect(() => {
//     if (formData.photoProfil) {
//       handlePhotoUpdate();
//     }
//   }, [formData.photoProfil, handlePhotoUpdate]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, photoProfil: e.target.files[0] });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setUpdateMessage('');

//     try {
//       const token = localStorage.getItem("token");
//       const formDataToSend = new FormData();
//       formDataToSend.append("sexe", formData.sexe);
//       formDataToSend.append("age", formData.age);
//       formDataToSend.append("posteOccupe", formData.posteOccupe);
//       if (formData.photoProfil) {
//         formDataToSend.append("photoProfil", formData.photoProfil);
//       }

//       const response = await axios.put("http://localhost:5000/api/auth/me", formDataToSend, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       setUpdateMessage(response.data.message);
//       fetchUserProfile(); // Re-fetch user profile to get updated data
//     } catch (err) {
//       setUpdateMessage("Erreur lors de la mise à jour des informations");
//       console.error("Erreur détaillée:", err);
//     }
//   };

//   if (loading) return <div>Chargement...</div>;
//   if (error) return <div>{error}</div>;
//   if (!user) return <div>Aucun utilisateur trouvé</div>;

//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//         <h1>Profil de {user.prenom} {user.nom}</h1>
//         <Link to="/home" className="home-button">Retour à l'accueil</Link>
//       </div>
//       <div className="profile-content">
//         <div className="profile-image-section">
//           <div className="profile-image-container">
//             <img src={`http://localhost:5000/images/${user.photoProfil}`} alt={`Profil de ${user.prenom} ${user.nom}`} />
//           </div>
//           <div className="profile-image-upload">
//             <label htmlFor="photoProfil" className="custom-file-upload">
//               Changer la photo
//               <input type="file" id="photoProfil" name="photoProfil" onChange={handleFileChange} />
//             </label>
//           </div>
//         </div>
//         <div className="profile-info-section">
//           <form onSubmit={handleUpdate}>
//             <div className="form-group">
//               <label htmlFor="sexe">Sexe</label>
//               <input type="text" id="sexe" name="sexe" value={formData.sexe} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="age">Âge</label>
//               <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="posteOccupe">Poste occupé</label>
//               <input type="text" id="posteOccupe" name="posteOccupe" value={formData.posteOccupe} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input type="text" id="email" name="email" value={user.email} disabled />
//             </div>
//             <div className="form-group">
//               <label htmlFor="isAdmin">Admin</label>
//               <input type="text" id="isAdmin" name="isAdmin" value={user.isAdmin ? "Oui" : "Non"} disabled />
//             </div>
//             <div className="form-group">
//               <label htmlFor="createdAt">Compte créé le</label>
//               <input type="text" id="createdAt" name="createdAt" value={new Date(user.createdAt).toLocaleDateString()} disabled />
//             </div>
//             <div className="form-actions">
//               <button type="submit" className="save-button">Enregistrer</button>
//             </div>
//           </form>
//           {updateMessage && <p className="update-message">{updateMessage}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;


// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import '../../CSS/profilPage.css';

// function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updateMessage, setUpdateMessage] = useState('');

//   const [formData, setFormData] = useState({
//     sexe: '',
//     age: '',
//     posteOccupe: '',
//     photoProfil: null
//   });

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("Token:", token); // Debugging line
//       if (!token) {
//         throw new Error("Token manquant");
//       }

//       const response = await axios.get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUser(response.data);
//       setFormData({
//         sexe: response.data.sexe || '',
//         age: response.data.age || '',
//         posteOccupe: response.data.posteOccupe || '',
//         photoProfil: response.data.photoProfil || null
//       });
//       setLoading(false);
//     } catch (err) {
//       setError("Erreur lors de la récupération du profil");
//       setLoading(false);
//       console.error("Erreur détaillée:", err);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const handlePhotoUpdate = useCallback(async () => {
//     setUpdateMessage('');

//     try {
//       const token = localStorage.getItem("token");
//       const formDataToSend = new FormData();
//       if (formData.photoProfil) {
//         formDataToSend.append("photoProfil", formData.photoProfil);
//       } else {
//         setUpdateMessage("Veuillez sélectionner une photo à télécharger.");
//         return;
//       }

//       const response = await axios.put("http://localhost:5000/api/auth/me/photo", formDataToSend, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       setUpdateMessage(response.data.message);
//       fetchUserProfile(); // Re-fetch user profile to get updated data
//     } catch (err) {
//       setUpdateMessage("Erreur lors de la mise à jour de la photo de profil");
//       console.error("Erreur détaillée:", err);
//     }
//   }, [formData.photoProfil]);

//   useEffect(() => {
//     if (formData.photoProfil) {
//       handlePhotoUpdate();
//     }
//   }, [formData.photoProfil, handlePhotoUpdate]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     const maxSize = 5 * 1024 * 1024; // 5 MB

//     if (file.size > maxSize) {
//       setUpdateMessage(`Le fichier est trop grand. La taille maximale est de 5 Mo. Taille de votre fichier: ${(file.size / (1024 * 1024)).toFixed(2)} Mo`);
//     } else {
//       setFormData({ ...formData, photoProfil: file });
//       setUpdateMessage('');
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setUpdateMessage('');

//     try {
//       const token = localStorage.getItem("token");
//       const formDataToSend = new FormData();
//       formDataToSend.append("sexe", formData.sexe);
//       formDataToSend.append("age", formData.age);
//       formDataToSend.append("posteOccupe", formData.posteOccupe);
//       if (formData.photoProfil) {
//         formDataToSend.append("photoProfil", formData.photoProfil);
//       }

//       const response = await axios.put("http://localhost:5000/api/auth/me", formDataToSend, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       setUpdateMessage(response.data.message);
//       fetchUserProfile(); // Re-fetch user profile to get updated data
//     } catch (err) {
//       setUpdateMessage("Erreur lors de la mise à jour des informations");
//       console.error("Erreur détaillée:", err);
//     }
//   };

//   if (loading) return <div>Chargement...</div>;
//   if (error) return <div>{error}</div>;
//   if (!user) return <div>Aucun utilisateur trouvé</div>;

//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//         <h1>Profil de {user.prenom} {user.nom}</h1>
//         <Link to="/home" className="home-button">Retour à l'accueil</Link>
//       </div>
//       <div className="profile-content">
//         <div className="profile-image-section">
//           <div className="profile-image-container">
//             <img src={`http://localhost:5000/images/${user.photoProfil}`} alt={`Profil de ${user.prenom} ${user.nom}`} />
//           </div>
//           <div className="profile-image-upload">
//             <label htmlFor="photoProfil" className="custom-file-upload">
//               Changer la photo
//               <input type="file" id="photoProfil" name="photoProfil" onChange={handleFileChange} />
//             </label>
//           </div>
//         </div>
//         <div className="profile-info-section">
//           <form onSubmit={handleUpdate}>
//             <div className="form-group">
//               <label htmlFor="sexe">Sexe</label>
//               <input type="text" id="sexe" name="sexe" value={formData.sexe} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="age">Âge</label>
//               <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="posteOccupe">Poste occupé</label>
//               <input type="text" id="posteOccupe" name="posteOccupe" value={formData.posteOccupe} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input type="text" id="email" name="email" value={user.email} disabled />
//             </div>
//             <div className="form-group">
//               <label htmlFor="isAdmin">Admin</label>
//               <input type="text" id="isAdmin" name="isAdmin" value={user.isAdmin ? "Oui" : "Non"} disabled />
//             </div>
//             <div className="form-group">
//               <label htmlFor="createdAt">Compte créé le</label>
//               <input type="text" id="createdAt" name="createdAt" value={new Date(user.createdAt).toLocaleDateString()} disabled />
//             </div>
//             <div className="form-actions">
//               <button type="submit" className="save-button">Enregistrer</button>
//             </div>
//           </form>
//           {updateMessage && <p className="update-message">{updateMessage}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import '../../CSS/profilPage.css';

// function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updateMessage, setUpdateMessage] = useState('');

//   const [formData, setFormData] = useState({
//     sexe: '',
//     age: '',
//     posteOccupe: '',
//     photoProfil: null
//   });

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       //console.log("Token:", token); // Debugging line
//       if (!token) {
//         throw new Error("Token manquant");
//       }

//       const response = await axios.get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUser(response.data);
//       setFormData({
//         sexe: response.data.sexe || '',
//         age: response.data.age || '',
//         posteOccupe: response.data.posteOccupe || '',
//         photoProfil: response.data.photoProfil || null
//       });
//       setLoading(false);
//     } catch (err) {
//       setError("Erreur lors de la récupération du profil");
//       setLoading(false);
//       console.error("Erreur détaillée:", err);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const handlePhotoUpdate = useCallback(async () => {
//     setUpdateMessage('');

//     try {
//       const token = localStorage.getItem("token");
//       const formDataToSend = new FormData();
//       if (formData.photoProfil) {
//         formDataToSend.append("photoProfil", formData.photoProfil);
//       } else {
//         setUpdateMessage("Veuillez sélectionner une photo à télécharger.");
//         return;
//       }

//       const response = await axios.put("http://localhost:5000/api/auth/me/photo", formDataToSend, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       setUpdateMessage(response.data.message);
//       fetchUserProfile(); // Re-fetch user profile to get updated data
//     } catch (err) {
//       if (err.response && err.response.data && err.response.data.message) {
//         setUpdateMessage(err.response.data.message);
//       } else {
//         setUpdateMessage("Erreur lors de la mise à jour de la photo de profil");
//       }
//       console.error("Erreur détaillée:", err);
//     }
//   }, [formData.photoProfil]);

//   useEffect(() => {
//     if (formData.photoProfil) {
//       handlePhotoUpdate();
//     }
//   }, [formData.photoProfil, handlePhotoUpdate]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     const maxSize = 5 * 1024 * 1024; // 5 MB

//     if (file.size > maxSize) {
//       const fileSizeInMo = (file.size / (1024 * 1024)).toFixed(2);
//       setUpdateMessage(`Le fichier est trop grand. La taille maximale est de 5 Mo. Votre fichier fait : ${fileSizeInMo} Mo`);
//     } else {
//       setFormData({ ...formData, photoProfil: file });
//       setUpdateMessage('');
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setUpdateMessage('');

//     try {
//       const token = localStorage.getItem("token");
//       const formDataToSend = new FormData();
//       formDataToSend.append("sexe", formData.sexe);
//       formDataToSend.append("age", formData.age);
//       formDataToSend.append("posteOccupe", formData.posteOccupe);
//       if (formData.photoProfil) {
//         formDataToSend.append("photoProfil", formData.photoProfil);
//       }

//       const response = await axios.put("http://localhost:5000/api/auth/me", formDataToSend, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       setUpdateMessage(response.data.message);
//       fetchUserProfile(); // Re-fetch user profile to get updated data
//     } catch (err) {
//       if (err.response && err.response.data && err.response.data.message) {
//         setUpdateMessage(err.response.data.message);
//       } else {
//         setUpdateMessage("Erreur lors de la mise à jour des informations");
//       }
//       console.error("Erreur détaillée:", err);
//     }
//   };

//   if (loading) return <div>Chargement...</div>;
//   if (error) return <div>{error}</div>;
//   if (!user) return <div>Aucun utilisateur trouvé</div>;

//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//         <h1>Profil de {user.prenom} {user.nom}</h1>
//         <Link to="/home" className="home-button">Retour à l'accueil</Link>
//       </div>
//       <div className="profile-content">
//         <div className="profile-image-section">
//           <div className="profile-image-container">
//             <img src={`http://localhost:5000/images/${user.photoProfil}`} alt={`Profil de ${user.prenom} ${user.nom}`} />
//           </div>
//           <div className="profile-image-upload">
//             <label htmlFor="photoProfil" className="custom-file-upload">
//               Changer la photo
//               <input type="file" id="photoProfil" name="photoProfil" onChange={handleFileChange} />
//             </label>
//           </div>
//         </div>
//         <div className="profile-info-section">
//           <form onSubmit={handleUpdate}>
//             <div className="form-group">
//               <label htmlFor="sexe">Sexe</label>
//               <input type="text" id="sexe" name="sexe" value={formData.sexe} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="age">Âge</label>
//               <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="posteOccupe">Poste occupé</label>
//               <input type="text" id="posteOccupe" name="posteOccupe" value={formData.posteOccupe} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input type="text" id="email" name="email" value={user.email} disabled />
//             </div>
//             <div className="form-group">
//               <label htmlFor="isAdmin">Admin</label>
//               <input type="text" id="isAdmin" name="isAdmin" value={user.isAdmin ? "Oui" : "Non"} disabled />
//             </div>
//             <div className="form-group">
//               <label htmlFor="createdAt">Compte créé le</label>
//               <input type="text" id="createdAt" name="createdAt" value={new Date(user.createdAt).toLocaleDateString()} disabled />
//             </div>
//             <div className="form-actions">
//               <button type="submit" className="save-button">Enregistrer</button>
//             </div>
//           </form>
//           {updateMessage && (
//             <p className={`update-message ${
//               updateMessage.toLowerCase().includes("erreur") ? "update-message-error" : "update-message-success"
//             }`}>
//               {updateMessage}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import '../../CSS/profilPage.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');

  const [formData, setFormData] = useState({
    sexe: '',
    age: '',
    posteOccupe: '',
    photoProfil: null
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token manquant");
      }

      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        sexe: response.data.sexe || '',
        age: response.data.age || '',
        posteOccupe: response.data.posteOccupe || '',
        photoProfil: response.data.photoProfil || null
      });
      setLoading(false);
    } catch (err) {
      setError("Erreur lors de la récupération du profil");
      setLoading(false);
      console.error("Erreur détaillée:", err);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handlePhotoUpdate = useCallback(async () => {
    setUpdateMessage('');

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      if (formData.photoProfil) {
        formDataToSend.append("photoProfil", formData.photoProfil);
      } else {
        setUpdateMessage("Veuillez sélectionner une photo à télécharger.");
        return;
      }

      const response = await axios.put("http://localhost:5000/api/auth/me/photo", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setUpdateMessage(response.data.message);
      fetchUserProfile();
    } catch (err) {
      setUpdateMessage(err.response?.data?.message || "Erreur lors de la mise à jour de la photo de profil");
      console.error("Erreur détaillée:", err);
    }
  }, [formData.photoProfil, fetchUserProfile]);

  useEffect(() => {
    if (formData.photoProfil) {
      handlePhotoUpdate();
    }
  }, [formData.photoProfil, handlePhotoUpdate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (file.size > maxSize) {
      const fileSizeInMo = (file.size / (1024 * 1024)).toFixed(2);
      setUpdateMessage(`Le fichier est trop grand. La taille maximale est de 5 Mo. Votre fichier fait : ${fileSizeInMo} Mo`);
    } else {
      setFormData({ ...formData, photoProfil: file });
      setUpdateMessage('');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateMessage('');

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("sexe", formData.sexe);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("posteOccupe", formData.posteOccupe);
      if (formData.photoProfil) {
        formDataToSend.append("photoProfil", formData.photoProfil);
      }

      const response = await axios.put("http://localhost:5000/api/auth/me", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setUpdateMessage(response.data.message);
      fetchUserProfile();
    } catch (err) {
      setUpdateMessage(err.response?.data?.message || "Erreur lors de la mise à jour des informations");
      console.error("Erreur détaillée:", err);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Aucun utilisateur trouvé</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profil de {user.prenom} {user.nom}</h1>
        <Link to="/home" className="home-button">Retour à l'accueil</Link>
      </div>
      <div className="profile-content">
        <div className="profile-image-section">
          <div className="profile-image-container">
            {user.photoProfil ? (
              <img src={`http://localhost:5000/images/${user.photoProfil}`} alt={`Profil de ${user.prenom} ${user.nom}`} />
            ) : (
              <FontAwesomeIcon icon={faUser} size="5x" />
            )}
          </div>
          <div className="profile-image-upload">
            <label htmlFor="photoProfil" className="custom-file-upload">
              Changer la photo
              <input type="file" id="photoProfil" name="photoProfil" onChange={handleFileChange} />
            </label>
          </div>
        </div>
        <div className="profile-info-section">
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="sexe">Sexe</label>
              <input type="text" id="sexe" name="sexe" value={formData.sexe} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="age">Âge</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="posteOccupe">Poste occupé</label>
              <input type="text" id="posteOccupe" name="posteOccupe" value={formData.posteOccupe} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" name="email" value={user.email} disabled />
            </div>
            <div className="form-group">
              <label htmlFor="isAdmin">Admin</label>
              <input type="text" id="isAdmin" name="isAdmin" value={user.isAdmin ? "Oui" : "Non"} disabled />
            </div>
            <div className="form-group">
              <label htmlFor="createdAt">Compte créé le</label>
              <input type="text" id="createdAt" name="createdAt" value={new Date(user.createdAt).toLocaleDateString()} disabled />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">Enregistrer</button>
            </div>
          </form>
          {updateMessage && (
            <p className={`update-message ${
              updateMessage.toLowerCase().includes("erreur") ? "update-message-error" : "update-message-success"
            }`}>
              {updateMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;