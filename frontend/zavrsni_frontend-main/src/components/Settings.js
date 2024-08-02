import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';
import { updateUser } from '../modules/fetchData';

function Settings({ user, onUpdateUser }) {
  
  const [editedUser, setEditedUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    console.log("Radi li=",savedUser);
    return savedUser ? JSON.parse(savedUser) : {};
  });

  useEffect(() => {
    console.log("User data in Settings component:", user);
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUser(editedUser);
      onUpdateUser(updatedUser); 
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('User updated:', updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };  

  return (
    <div className="settings-container">
      <h2>Pozdrav, {user.username}! <br></br> Uredi svoj korisnički račun:</h2>
      <form onSubmit={handleSubmit}>
        <div className="settings-group">
          <label className="settings-label" htmlFor="name">Ime:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={editedUser.name || ''}
            onChange={handleChange}
            className="settings-input"
          />
        </div>
        <div className="settings-group">
          <label className="settings-label" htmlFor="surname">Prezime:</label>
          <input
            type="text"
            name="surname"
            id="surname"
            value={editedUser.surname || ''}
            onChange={handleChange}
            className="settings-input"
          />
        </div>
        <div className="settings-group">
          <label className="settings-label" htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={editedUser.email || ''}
            onChange={handleChange}
            className="settings-input"
          />
        </div>
        <div className="settings-group">
          <label className="settings-label" htmlFor="dateOfBirth">Datum rođenja:</label>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={editedUser.dateOfBirth || ''}
            onChange={handleChange}
            className="settings-input"
          />
        </div>
        <div className="settings-group">
          <label className="settings-label" htmlFor="gender">Spol:</label>
          <select
            name="gender"
            id="gender"
            value={editedUser.gender ? "male" : "female"} 
            onChange={handleChange}
            className="settings-input"
          >
            <option value="male">Muški</option>
            <option value="female">Ženski</option>
          </select>
        </div>
        <button className="edit-button" type="submit">Spremi</button>
      </form>
    </div>
  );
}

export default Settings;
