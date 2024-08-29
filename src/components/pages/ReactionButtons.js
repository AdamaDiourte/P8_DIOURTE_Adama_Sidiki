import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import '../../CSS/ReactionButtons.css';

function ReactionButtons({ postId, likes, dislikes, userReaction, onReactionUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  console.log(`ReactionButtons rendu pour le post ${postId}:`, { likes, dislikes, userReaction });

  const handleReaction = async (reactionType) => {
    console.log(`Réaction ${reactionType} déclenchée pour le post ${postId}`);
    if (isUpdating) return;

    setIsUpdating(true);

    const isAddingReaction = userReaction !== reactionType;
    const newLikes = reactionType === 'like'
      ? likes + (isAddingReaction ? 1 : -1)
      : userReaction === 'like' ? likes - 1 : likes;
    const newDislikes = reactionType === 'dislike'
      ? dislikes + (isAddingReaction ? 1 : -1)
      : userReaction === 'dislike' ? dislikes - 1 : dislikes;
    const newUserReaction = isAddingReaction ? reactionType : null;

    console.log(`Mise à jour optimiste pour le post ${postId}:`, { newLikes, newDislikes, newUserReaction });

    // Mise à jour optimiste
    onReactionUpdate({ likes: newLikes, dislikes: newDislikes, userReaction: newUserReaction });

    try {
      const token = localStorage.getItem('token');
      
      console.log(`Envoi de la requête API pour le post ${postId}`);
      const response = await axios.post(`/api/posts/${postId}/${reactionType}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`Réponse de l'API pour le post ${postId}:`, response.data);
      
      // Mise à jour avec les données du serveur
      onReactionUpdate(response.data);
    } catch (err) {
      console.error(`Erreur lors de la réaction au post ${postId}:`, err);
      // En cas d'erreur, revenir à l'état initial
      onReactionUpdate({ likes, dislikes, userReaction });
    } finally {
      setIsUpdating(false);
    }
  };

  console.log(`État actuel pour le post ${postId}:`, { likes, dislikes, userReaction });

  return (
    <div className="post-actions">
      <button 
        onClick={() => handleReaction('like')} 
        className={`reaction-button like-button ${userReaction === 'like' ? 'active' : ''}`}
        disabled={isUpdating}
      >
        <FontAwesomeIcon icon={faThumbsUp} />
        <span className="reaction-count">{likes}</span>
      </button>
      <button 
        onClick={() => handleReaction('dislike')} 
        className={`reaction-button dislike-button ${userReaction === 'dislike' ? 'active' : ''}`}
        disabled={isUpdating}
      >
        <FontAwesomeIcon icon={faThumbsDown} />
        <span className="reaction-count">{dislikes}</span>
      </button>
    </div>
  );
}

export default ReactionButtons;