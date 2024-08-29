import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/createCommentPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:50001/api';

const CreateCommentPage = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { postId } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!content.trim()) {
      setError('Le commentaire ne peut pas être vide');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = `${API_URL}/posts/${postId}/comments`;
      console.log('Sending request to:', url);

      const response = await axios.post(
        url,
        { content },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response:', response.data);
      const { message } = response.data;
      console.log(message);
      setContent('');
      setIsSubmitting(false);
      
      // Redirection vers la page du post spécifique
      navigate('/postsPage');
    } catch (err) {
      console.error('Erreur détaillée:', err.response || err);
      setError(
        err.response?.data?.error || 
        `Erreur lors de l'ajout du commentaire: ${err.message}`
      );
      setIsSubmitting(false);
    }
  };

  const handleTextareaChange = (e) => {
    setContent(e.target.value);
    adjustTextareaHeight();
  };

  const handleCancel = () => {
    navigate(`/posts/${postId}`);  // Redirection vers la page du post spécifique en cas d'annulation
  };

  return (
    <div className="create-comment-page">
      <h2>Ajouter un commentaire</h2>
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="commentContent">Votre commentaire</label>
          <textarea
            id="commentContent"
            ref={textareaRef}
            className="form-control"
            value={content}
            onChange={handleTextareaChange}
            placeholder="Saisissez votre commentaire ici..."
            rows="4"
          ></textarea>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="button-group">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Envoi en cours...' : 'Ajouter le commentaire'}
          </button>
          <button type="button" onClick={handleCancel} className="cancel-button">
            Annuler
          </button>
          
        </div>
      </form>
    </div>
  );
};

export default CreateCommentPage;