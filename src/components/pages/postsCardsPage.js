import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/postsCardsPage.css';
import ReactionButtons from './ReactionButtons';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:50001/api';

const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
});

const PostsCardsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});

  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const postsData = response.data.posts || [];

      const postsWithCommentCounts = await Promise.all(postsData.map(async (post) => {
        try {
          const commentsResponse = await axiosInstance.get(`${API_URL}/posts/${post.id}/comments`, {
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

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const navigateToCommentPage = (comment) => {
    console.log('Navigating to comment page:', comment);
    navigate(`/comments/${comment.id}`);
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
                <div key={comment.id} className="comment" onClick={() => navigateToCommentPage(comment)}>
                  <p className="commenter-name">{comment.authorPrenom} {comment.authorNom}</p>
                  <p className="comment-content">{comment.content}</p>
                  <p className="comment-meta">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
              ))}
              <div className="comments-buttons">
                <button 
                  className="add-comment-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/create-comment/${post.id}`);
                  }}
                >
                  Ajouter un commentaire
                </button>
                {hasMoreComments && (
                  <button 
                    className="toggle-comments-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComments(post.id);
                    }}
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