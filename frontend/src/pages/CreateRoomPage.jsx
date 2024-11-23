import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateRoomPage({ socket }) {
  const [username, setUsername] = useState('');
  const [subject, setSubject] = useState('General Knowledge');
  const subjects = ['General Knowledge', 'Science', 'History', 'Sports', 'Entertainment'];
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    socket.emit('createRoom', { username, subject });
    socket.on('roomCreated', ({ roomId }) => {
      navigate(`/game?roomId=${roomId}&username=${username}`);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Room</h2>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Subject:
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button onClick={handleCreateRoom} style={{ marginTop: '20px' }}>
        Create Room
      </button>
    </div>
  );
}

export default CreateRoomPage;
