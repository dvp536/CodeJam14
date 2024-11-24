import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import './Styling/Menu.css'; // Import the external CSS file

function Menu() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError(''); // Clear error when the user starts typing
  };

  const CreateRoom = () => {
    if (!username.trim()) {
      setError('Please enter a username before proceeding.');
      return;
    }
    console.log(`Creating a new room for ${username}...`);
    navigate('/createRoom', { state: { username } }); // Pass username to the next page
  };

  const JoinRoom = () => {
    if (!username.trim()) {
      setError('Please enter a username before proceeding.');
      return;
    }
    console.log(`${username} is joining the multiplayer lobby...`);
    navigate('/joinRoom', { state: { username } }); // Pass username to the next page
  };

  return (
    <div className="menu-container">
      <div className="background-image">
        <div className="content">
          <h2 className="menu-title">Main Menu</h2>
          <p className="menu-paragraph">Welcome to the Trivia Game! Please enter your username below:</p>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={handleInputChange}
            className="menu-input"
          />
          {error && <p className="menu-error">{error}</p>}
          <button className="menu-button" onClick={CreateRoom} disabled={!username.trim()}>
            Create Room
          </button>
          <button className="menu-button multiplayer-button" onClick={JoinRoom} disabled={!username.trim()}>
            Multiplayer Lobby
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
