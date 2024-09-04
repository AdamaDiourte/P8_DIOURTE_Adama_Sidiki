import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../../CSS/getOneCommentPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:50001/api';

const GetOneCommentPage = () => {
  const { commentId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserId = localStorage.getItem('userId');

  console.log('Current User ID:', currentUserId);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data);
        setComment(response.data);
        setEditedContent(response.data.content);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération du commentaire:', error);
        setError('Une erreur est survenue lors de la récupération du commentaire.');
        setLoading(false);
      }
    };

    fetchComment();
  }, [commentId]);

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/comments/${commentId}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Edit Response:', response.data);
      setComment(prevComment => ({ ...prevComment, content: editedContent }));
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
      setError('Une erreur est survenue lors de la mise à jour du commentaire.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(-1); // Retourne à la page précédente après la suppression
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      setError('Une erreur est survenue lors de la suppression du commentaire.');
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!comment) return <div className="error-message">Commentaire non trouvé.</div>;

  const commentUserId = comment.userId || comment.user_id;
  const isAuthor = currentUserId === String(commentUserId);

  console.log('Is Author:', isAuthor);
  console.log('Comment User ID:', commentUserId);

  return (
    <div className="comment-page">
      <Link to="/postsPage" className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} /> Retour aux posts
      </Link>
      <div className="comment-details">
        <h2>Commentaire</h2>
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="edit-content"
            />
            <div className="edit-actions">
              <button onClick={handleEdit} className="save-button">
                <FontAwesomeIcon icon={faSave} /> Sauvegarder
              </button>
              <button onClick={() => setIsEditing(false)} className="cancel-button">
                <FontAwesomeIcon icon={faTimes} /> Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="comment-content">{comment.content}</p>
            <p className="comment-meta">
              Par <span className="comment-author">{comment.authorPrenom} {comment.authorNom}</span> • 
              {new Date(comment.createdAt).toLocaleString()}
            </p>
            {isAuthor && (
              <div className="comment-actions">
                <button onClick={() => setIsEditing(true)} className="edit-button">
                  <FontAwesomeIcon icon={faEdit} /> Modifier
                </button>
                {!isDeleting ? (
                  <button onClick={() => setIsDeleting(true)} className="delete-button">
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                  </button>
                ) : (
                  <div className="delete-confirmation">
                    <p>Êtes-vous sûr de vouloir supprimer ce commentaire ?</p>
                    <button onClick={handleDelete} className="confirm-delete">
                      Oui, supprimer
                    </button>
                    <button onClick={() => setIsDeleting(false)} className="cancel-button">
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GetOneCommentPage;
