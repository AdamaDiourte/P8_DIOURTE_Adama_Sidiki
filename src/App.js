//App.js du frontend 

import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/App.css';
import SignupForm from './components/users/userSignup';
import Login from './components/users/userLogin';
import GrillePosts from './components/homePage/grillePosts';
import ProfilePage from './components/pages/profilPage';
import PostsCardsPage from './components/pages/postsCardsPage';
import OnePostPage from './components/pages/onePostPage';
import CreatePostPage from './components/pages/createPostPage';
import CreateCommentPage from './components/pages/createCommentPage';
import LogoutPage from './components/homePage/logOutButton';
import UsersHomePage from './components/users/usersHomePage';
import NavBar from './components/homePage/navBar';
import ErrorPage from './components/pages/errorPage';
import { AuthProvider, AuthContext } from './components/users/authContext';

function App() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:5000');
        setMessage(response.data);
      } catch (error) {
        console.error('Erreur lors de la connexion au serveur:', error);
        setMessage('Erreur de connexion au serveur');
        setError('Erreur de connexion au serveur');
      }
    };

    fetchInitialData();
  }, []);

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <Router>
      <AuthProvider>
        <AppContent message={message} />
      </AuthProvider>
    </Router>
  );
}

function AppContent({ message }) {
  const { isLoggedIn, logout } = useContext(AuthContext);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      {isLoggedIn && <NavBar onLogout={logout} />}
      <h1>Mon Application Sociale</h1>
      <p>{message}</p>

      <Routes>
        <Route path="/" element={<UsersHomePage />} />
        <Route path="/home" element={<PrivateRoute><GrillePosts /></PrivateRoute>} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />
        <Route path="/profilPage" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/postsPage" element={<PrivateRoute><PostsCardsPage /></PrivateRoute>} />
        <Route path="/posts/:id" element={<PrivateRoute><OnePostPage /></PrivateRoute>} />
        <Route path="/create-post" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
        <Route path="/create-comment/:postId" element={<PrivateRoute><CreateCommentPage /></PrivateRoute>} />
        <Route path="/logOutPage" element={<LogoutPage onLogout={logout} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;