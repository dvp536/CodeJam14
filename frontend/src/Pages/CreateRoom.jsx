import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styling/CreateRoom.css'; // Import the CSS file

function CreateRoom() {
  const navigate = useNavigate();
  const [roomTitle, setRoomTitle] = useState('');
  const [rounds, setRounds] = useState(5);
  const [defaultMoney, setDefaultMoney] = useState(100);

  const handleCreateRoom = () => {
    console.log({ roomTitle, rounds, defaultMoney });
    navigate('/waitingRoom'); // Navigate to the game screen
  };

  const handleResetForm = () => {
    setRoomTitle('');
    setRounds(5);
    setDefaultMoney(100);
  };

  return (
    <div className="create-room-container">
      <button 
        className="back-button" 
        onClick={() => navigate('/')}
      >
        Back
      </button>
      <h2 className="create-room-title">Create Room</h2>
      <input
        type="text"
        className="room-input"
        placeholder="Room Title"
        value={roomTitle}
        onChange={(e) => setRoomTitle(e.target.value)}
      />
      <span className="label">Number of Rounds:</span>
      <input
        type="number"
        className="room-input"
        placeholder="Number of Rounds"
        value={rounds}
        onChange={(e) => setRounds(parseInt(e.target.value, 10))}
      />
      <span className="label">Default Money:</span>
      <input
        type="number"
        className="room-input"
        placeholder="Default Money"
        value={defaultMoney}
        onChange={(e) => setDefaultMoney(parseInt(e.target.value, 10))}
      />
      <button className="room-button" onClick={handleCreateRoom}>
        Create Room
      </button>
      <button className="room-reset-button" onClick={handleResetForm}>
        Reset
      </button>

      {/* Preview Section */}
      <div className="room-preview">
        <h3>Room Preview</h3>
        <p><strong>Title:</strong> {roomTitle || 'N/A'}</p>
        <p><strong>Rounds:</strong> {rounds}</p>
        <p><strong>Default Money:</strong> ${defaultMoney}</p>
      </div>
    </div>
  );
}

export default CreateRoom;
