import React, { useState, useEffect } from 'react';
import '../styles/AddChildForm.css';
import { createEmployee } from '../modules/fetchData';

function AddChildForm({ onEmployeeAdded }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [kidMale, setKidMale] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [qualities, setQualities] = useState('');
    const [preferences, setPreferences] = useState('');
    const [special, setSpecial] = useState('');
    const [managerId, setManagerId] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            const loggedInUserId = loggedInUser.id;
            setManagerId(loggedInUserId);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            name: name,
            surname: surname,
            password: password,
            email: email,
            kidMale: kidMale,
            dateOfBirth: dateOfBirth,
            qualities: qualities,
            preferences: preferences,
            special: special,
            managerId: managerId 
        };

        createEmployee(formData)
          .then((data) => {
            onEmployeeAdded(data); 
            setName('');
            setSurname('');
            setPassword('');
            setEmail('');
            setKidMale('');
            setDateOfBirth('');
            setQualities('');
            setPreferences('');
            setSpecial('');
          })
          .catch((error) => {
            console.error(error);
            setErrorMessage('E-mail već postoji. Molimo izaberite drugi!');
          });    
    };

  return (
    <form className="addChild-form" onSubmit={handleSubmit}>
        {errorMessage && <div style={{ marginBottom: '10px', color: '#c70000', fontWeight: '700' }} >{errorMessage}</div>}
        <div>
            <label>Ime:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
            <label>Prezime:</label>
            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />
        </div>
        <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
            <label>Lozinka:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
            <label>Datum rođenja:</label>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
        </div>
        <div>
            <label>Spol:</label>
            <select
            value={kidMale}
            onChange={(e) => setKidMale(e.target.value)}
            required
            >
            <option value="">Odaberi spol</option>
            <option value="true">Muški</option>
            <option value="false">Ženski</option>
            </select>
        </div>
        <div>
            <label>Kvalitete:</label>
            <textarea value={qualities} onChange={(e) => setQualities(e.target.value)} />
        </div>
        <div>
            <label>Preferencije:</label>
            <textarea value={preferences} onChange={(e) => setPreferences(e.target.value)} />
        </div>
        <div>
            <label>Specijalni zahtjevi:</label>
            <textarea value={special} onChange={(e) => setSpecial(e.target.value)} />
        </div>
        <button type="submit">Kreiraj profil zaposlenika</button>
    </form>
  );
}

export default AddChildForm;
