import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link  } from 'react-router-dom';

import '../styles/LoginForm.css';
import logo from '../assets/logoapp.png';

function LoginForm({ onLogin, isAuthenticated, setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const success = await onLogin(credentials);
      if (success) {
        setIsAuthenticated(true);
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        setErrorMessage('Nevalidni kredencijali!');
      }
    } catch (error) {
      console.error('Greška prilikom prijave:', error);
      setErrorMessage('Desila se greška prilikom prijave');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center'}}>
          <img src={logo} alt="Logo" style={{ width: '180px', marginTop: '25px', marginRight: '170px' }} />
      </div>
      <div className="LoginForm">
        <form onSubmit={handleSubmit}>
          
          <h2 style={{ marginBottom: '2rem' }}>Prijava</h2>
          {errorMessage && <div style={{ marginBottom: '10px', color: '#c70000', fontWeight: '700' }} >{errorMessage}</div>}

          <div className="input-group">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
            </div>
            <input type="text" name="username" placeholder="Korisničko ime ili email" value={credentials.username} onChange={handleInputChange} />
          </div>

          <div className="input-group">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
            </div>
            <input type="password" name="password" placeholder="Lozinka" value={credentials.password} onChange={handleInputChange} />
          </div>

          <button className="loginform-button" type="submit">Prijavi se</button>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '0.5rem', marginTop: '1px', verticalAlign: 'middle' }}><p>Nemaš korisnički račun?</p></div>
            <Link to="/register">
              <button style={{ color: '#07255d', textDecoration: 'none', cursor: 'pointer', border: 'none', background: 'none', padding: 0, verticalAlign: 'middle', fontSize: '15px' }}>
                Registruj se
              </button>
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default LoginForm;
