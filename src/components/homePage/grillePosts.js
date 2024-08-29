import React from 'react';
import PostsCardsPage from '../pages/postsCardsPage';
import '../../CSS/grillePosts.css';


function GrillePosts() {
  return (
    <div className="grille-posts">
      <h2>Tous les posts</h2>
      <PostsCardsPage />
    </div>
  );
}

export default GrillePosts;