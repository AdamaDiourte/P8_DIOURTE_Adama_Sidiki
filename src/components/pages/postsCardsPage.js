import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import '../../CSS/postsCardsPage.css';
import ReactionButtons from './ReactionButtons';

const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
});

const PostsCardsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const postsData = response.data.posts || [];

      const postsWithCommentCounts = await Promise.all(postsData.map(async (post) => {
        try {
          const commentsResponse = await axiosInstance.get(`/api/posts/${post.id}/comments`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return {
            ...post,
            comments: commentsResponse.data.comments,
            commentCount: commentsResponse.data.comments.length
          };
        } catch (commentsErr) {
          console.error(`Erreur lors de la récupération des commentaires pour le post ${post.id}:`, commentsErr);
          return {
            ...post,
            comments: [],
            commentCount: 0,
            commentsError: `Erreur de récupération des commentaires.`
          };
        }
      }));

      setPosts(postsWithCommentCounts);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des posts:', err);
      setError('Erreur lors de la récupération des posts: ' + err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleReactionUpdate = useCallback((postId, updatedPostData) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { ...post, ...updatedPostData } : post
    ));
  }, []);

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditCommentContent(content);
  };

  const handleUpdateComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(`/api/comments/${commentId}`, 
        { content: editCommentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map(comment => 
                comment.id === commentId
                  ? { ...comment, content: editCommentContent }
                  : comment
              )
            }
          : post
      ));
      setEditingCommentId(null);
      setEditCommentContent('');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du commentaire:', err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      try {
        const token = localStorage.getItem('token');
        await axiosInstance.delete(`/api/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPosts(prevPosts => prevPosts.map(post => 
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(comment => comment.id !== commentId),
                commentCount: post.commentCount - 1
              }
            : post
        ));
      } catch (err) {
        console.error('Erreur lors de la suppression du commentaire:', err);
      }
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const navigateToCommentPage = (postId) => {
    navigate(`/create-comment/${postId}`);
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="social-network-page">
      <h1>Tous les Posts</h1>
      {posts.map(post => {
        const isExpanded = expandedComments[post.id];
        const displayedComments = isExpanded ? post.comments : post.comments.slice(0, 3);
        const hasMoreComments = post.comments.length > 3;

        return (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <h2 className="post-title">{post.title}</h2>
              <div className="post-meta">
                <span>Par {post.authorPrenom}</span>
                <span> • {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="post-content">
              <p>{post.content.substring(0, 100)}...</p>
              <Link to={`/posts/${post.id}`}>Lire la suite</Link>
            </div>
            <div className="reaction-buttons">
              <ReactionButtons
                postId={post.id}
                likes={post.likes}
                dislikes={post.dislikes}
                userReaction={post.userReaction}
                onReactionUpdate={(updatedData) => handleReactionUpdate(post.id, updatedData)}
              />
            </div>
            
            <div className="comments-section">
              <h3>Commentaires ({post.commentCount})</h3>
              {displayedComments.map(comment => (
                <div key={comment.id} className="comment">
                  {editingCommentId === comment.id ? (
                    <div className="edit-comment-form">
                      <textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                      />
                      <button onClick={() => handleUpdateComment(post.id, comment.id)}>Modifier</button>
                      <button onClick={() => setEditingCommentId(null)}>Annuler</button>
                    </div>
                  ) : (
                    <>
                      <p className="commenter-name">{comment.authorPrenom} {comment.authorNom}</p>
                      <p className="comment-content">{comment.content}</p>
                      <p className="comment-meta">{new Date(comment.createdAt).toLocaleString()}</p>
                      {currentUserId === comment.userId && (
                        <div className="comment-actions">
                          <button onClick={() => handleEditComment(comment.id, comment.content)}>
                            <FaPencilAlt />
                          </button>
                          <button onClick={() => handleDeleteComment(post.id, comment.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              <div className="comments-buttons">
                <button 
                  className="add-comment-button" 
                  onClick={() => navigateToCommentPage(post.id)}
                >
                  Ajouter un commentaire
                </button>
                {hasMoreComments && (
                  <button 
                    className="toggle-comments-button" 
                    onClick={() => toggleComments(post.id)}
                  >
                    {isExpanded ? "Voir moins" : "Voir plus"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PostsCardsPage;
