import React, { useRef, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "../../CSS/profilImages.css";

function ProfileImage({ user, fetchUserProfile }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token manquant");
      }

      await axios.post("/api/user/upload-profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      await fetchUserProfile();
    } catch (err) {
      setError("Erreur lors du téléchargement de l'image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-picture-container">
      <button
        onClick={handleImageClick}
        className="profile-picture-button"
        aria-label="Changer la photo de profil"
      >
        <img 
          src={user.photoProfil} 
          alt={`Profil de ${user.prenom} ${user.nom}`} // Corrigé ici
          className="profile-picture"
        />
      </button>
      {uploading && <div className="upload-overlay">Téléchargement...</div>}
      {error && <div className="error-message">{error}</div>}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        style={{ display: "none" }}
        accept="image/*"
      />
    </div>
  );
}

ProfileImage.propTypes = {
  user: PropTypes.object.isRequired,
  fetchUserProfile: PropTypes.func.isRequired
};

export default ProfileImage;
