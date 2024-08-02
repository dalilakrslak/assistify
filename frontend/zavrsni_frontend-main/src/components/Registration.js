import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faUser, faLock, faEnvelope, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Registration.css';
import logo from '../assets/logoapp.png';

const Registration = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [kidMale, setKidMale] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const API_BASE_URL = 'https://magicplannerbe-production.up.railway.app';

  const handleSubmit = (e) => {
    e.preventDefault();

    const accountRequest = {
      name: name,
      surname: surname,
      password: password,
      email: email,
      kidMale: kidMale,
      dateOfBirth: dateOfBirth
    };

    fetch(`${API_BASE_URL}/api/v1/manager/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountRequest),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
    
        const createdAccount = data;
    
        setAccountData(createdAccount);
    
        setName('');
        setSurname('');
        setEmail('');
        setKidMale(false);
        setPassword('');
        setDateOfBirth('');
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('E-mail već postoji. Molimo izaberite drugi!');
      });    
  };

  const handleLoginClick = () => {
    setAccountData(null);
  };

  if (accountData) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <img src={logo} alt="Logo" style={{ width: '180px', marginTop: '25px', marginRight: '170px' }} />
      </div>
      <div className="registrated-container">
        <div className="account-created">
          <h2>Kreiran profil</h2>
          <div className="profile-details">
            <p><strong>Ime:</strong> {accountData.name}</p>
            <p><strong>Prezime:</strong> {accountData.surname}</p>
            <p><strong>Email:</strong> {accountData.email}</p>
            <p><strong>Datum rođenja:</strong> {accountData.dateOfBirth}</p>
            <p><strong>Korisničko ime:</strong> {accountData.username}</p>
          </div>
          <p className="note">
            <strong>*NAPOMENA*</strong> <br />
            <span>Za prijavu koristite Vaše korisničko ime ili email i lozinku!</span>
          </p>
          <Link to="/login">
            <button className="login-button" onClick={handleLoginClick}>Prijavi se</button>           
          </Link>  
        </div>
      </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center'}}>
          <img src={logo} alt="Logo" style={{ width: '180px', marginTop: '25px', marginRight: '170px' }} />
      </div>
      <div className="RegistrationForm">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '2rem' }}>Registracija</h2>
            {errorMessage && <div style={{ marginBottom: '10px', color: '#c70000', fontWeight: '700' }}>{errorMessage}</div>}
          </div>

          <div className='registration-row'>
            <div className="registration-group">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
              </div>
              <input type="text" placeholder="Ime" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="registration-group">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
              </div>
              <input type="text" placeholder="Prezime" value={surname} onChange={(e) => setSurname(e.target.value)} required />
            </div>
          </div>

          <div className='registration-row'>
            <div className="registration-group">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              </div>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="registration-group">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
              </div>
              <input type="password" placeholder="Lozinka" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <div className='registration-row'>
            <div>  
              <label htmlFor="dateOfBirth">Datum rođenja:</label>
              <div className="registration-group">
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
                </div>
                <input type="date"  value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
              </div>
            </div>
            <div className='gener'>  
              <label htmlFor="gender">Spol:</label>
              <div className="registration-gender">
                <input type="radio" id="male" name="gender" value="true" onChange={(e) => setKidMale(e.target.value)} required />
                <label htmlFor="male">Muški</label>
                <input type="radio" id="female" name="gender" value="false" onChange={(e) => setKidMale(e.target.value)} />
                <label htmlFor="female">Ženski</label>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <button type="submit">Registruj se</button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}><p>Već imaš korisnički račun?</p></div>
              <div>
                <Link to="/login">
                  <button style={{ fontSize: '15px', color: '#07255d', textDecoration: 'none', cursor: 'pointer', border: 'none', background: 'none', padding: 0, verticalAlign: 'middle' }}>Prijavi se</button>
                </Link>          
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
