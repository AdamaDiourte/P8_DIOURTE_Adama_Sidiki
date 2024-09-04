//export default OnePostPage;
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../../CSS/onePostPage.css';
import ReactionButtons from './ReactionButtons';

function OnePostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPost = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Aucun token trouvé');
      }
      const response = await axios.get(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(response.data);
      setEditedTitle(response.data.title);
      setEditedContent(response.data.content);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération du post:', err);
      setError('Erreur lors de la récupération du post: ' + err.message);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/posts/${id}`, 
        { title: editedTitle, content: editedContent }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setIsEditing(false);
      fetchPost();
    } catch (err) {
      console.error('Erreur lors de la modification du post:', err);
      setError('Erreur lors de la modification du post: ' + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/postsPage');
    } catch (err) {
      console.error('Erreur lors de la suppression du post:', err);
      setError('Erreur lors de la suppression du post: ' + err.message);
    }
  };

  const handleReactionUpdate = (updatedPostData) => {
    console.log("Mise à jour des réactions:", updatedPostData);
    setPost(prevPost => ({
      ...prevPost,
      likes: updatedPostData.likes,
      dislikes: updatedPostData.dislikes,
      userReaction: updatedPostData.userReaction
    }));
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="not-found">Post non trouvé</div>;

  return (
    <div className="post-page">
      <Link to="/postsPage" className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} /> Retour aux posts
      </Link>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="edit-title"
          />
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
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </>
      )}
      {post.mediaUrl && (
        <div className="post-media">
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} alt="Post media" />
          ) : post.mediaType === 'video' ? (
            <video src={post.mediaUrl} controls />
          ) : null}
        </div>
      )}
      <small>Publié le: {new Date(post.createdAt).toLocaleDateString()}</small>
      <div className="post-actions">
        <ReactionButtons
          postId={post.id}
          likes={post.likes}
          dislikes={post.dislikes}
          userReaction={post.userReaction}
          onReactionUpdate={handleReactionUpdate}
        />
        {post.isAuthor && (
          <>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="edit-button">
                <FontAwesomeIcon icon={faEdit} /> Modifier
              </button>
            )}
            {!isDeleting ? (
              <button onClick={() => setIsDeleting(true)} className="delete-button">
                <FontAwesomeIcon icon={faTrash} /> Supprimer
              </button>
            ) : (
              <div className="delete-confirmation">
                <p>Êtes-vous sûr de vouloir supprimer ce post ?</p>
                <button onClick={handleDelete} className="confirm-delete">
                  Oui, supprimer
                </button>
                <button onClick={() => setIsDeleting(false)} className="cancel-button">
                  Annuler
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OnePostPage;