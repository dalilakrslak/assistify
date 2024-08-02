import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Settings from './components/Settings';
import LoginForm from './components/LoginForm';
import Registration from './components/Registration';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import Materials from './components/Materials';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './modules/firebase';
import Chat from './components/Chat';
import './App.css';
import Employee from './components/Employee';



function App() {
  const [showHeaderAndSidebar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate(); 
  const [lastActivity, setLastActivity] = useState(Date.now());

  const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY;
  const API_BASE_URL = 'https://magicplannerbe-production.up.railway.app';

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true);
      setLastActivity(Date.now());
    }
  }, []);

  useEffect(() => {
    const inactivityTimer = setTimeout(() => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > 30 * 60 * 1000) {
        handleLogout();
      }
    }, 30 * 60 * 1000);

    return () => clearTimeout(inactivityTimer);
  }, [lastActivity]);


  const handleActivity = () => {
    setLastActivity(Date.now());
  };

  const handleLoginSubmit = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/manager/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        mode: 'cors'
      });

      if (response.ok) {
        const user = await response.json();
        await signInWithEmailAndPassword(auth, user.email, user.password);
        setUser(user);
        console.log('Prijavljen kao:', user);
        setIsAuthenticated(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        setLoginError(false);
        setLastActivity(Date.now());
        navigate('/');
      } else {
        setLoginError(true);
        console.error('Nevalidni podaci');
      }
    } catch (error) {
      console.error('Greska prilikom prijavljivanja:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    console.log('Odjavljivanje');
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/manager/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('User updated:', data);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="app" onMouseMove={handleActivity} onClick={handleActivity}>
      {showHeaderAndSidebar && (
        <div className="app-sidebar">
          <Sidebar
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        </div>
      )}
      <div className="app-window">
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated && (
                <LoginForm
                  onLogin={handleLoginSubmit}
                  setIsAuthenticated={setIsAuthenticated}
                  loginError={loginError}
                />
              )
            }
          />
          <Route path="/register" element={<Registration />} />
          {isAuthenticated ? (
            <>
              <Route path="/settings" element={<Settings user={user} onUpdateUser={handleUpdateUser} />} />
              <Route path="/" element={<Home />} />
              <Route path="/employee/:id" element={<Employee />} />
              <Route path="/material" element={<Materials />} />
              <Route path="/chat" element={<Chat />} />
            </>
          ) : (
            <Route path="/" element={<LoginForm onLogin={handleLoginSubmit} setIsAuthenticated={setIsAuthenticated} loginError={loginError} />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
