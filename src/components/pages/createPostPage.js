import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/createPostPage.css';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/posts', { title, content, mediaUrl, mediaType }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/postsPage');
    } catch (err) {
      console.error('Erreur lors de la création du post:', err);
      setError('Erreur lors de la création du post: ' + err.message);
    }
  };

  return (
    <div className="create-post-page">
      <h1>Créer un nouveau post</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="create-post-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du post"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenu du post"
          required
        />
        <input
          type="text"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="URL du média (optionnel)"
        />
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option value="">Type de média</option>
          <option value="image">Image</option>
          <option value="video">Vidéo</option>
        </select>
        <button type="submit">Créer le post</button>
      </form>
    </div>
  );
}

export default CreatePostPage;