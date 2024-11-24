// src/pages/CreateRoomPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateRoomPage({ socket }) {
  const [username, setUsername] = useState('');
  const [subject, setSubject] = useState('General Knowledge');
  const subjects = ['General Knowledge', 'Science', 'History', 'Sports', 'Entertainment'];
  const navigate = useNavigate();

  // New state variables for game settings
  const [startingMoney, setStartingMoney] = useState(100);
  const [additionalMoneyPerRound, setAdditionalMoneyPerRound] = useState(25);
  const [totalRounds, setTotalRounds] = useState(5);
  const [bettingTime, setBettingTime] = useState(15);
  const [questionTime, setQuestionTime] = useState(60);

  const handleCreateRoom = () => {
    const settings = {
      startingMoney,
      additionalMoneyPerRound,
      totalRounds,
      bettingTime,
      questionTime,
    };
    socket.emit('createRoom', { username, subject, settings });
    socket.on('roomCreated', ({ roomId }) => {
      navigate(`/lobby?roomId=${roomId}&username=${username}`);
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

      {/* New settings fields */}
      <div style={{ marginTop: '10px' }}>
        <label>
          Starting Money:
          <input
            type="number"
            value={startingMoney}
            min="1"
            onChange={(e) => setStartingMoney(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Additional Money Per Round:
          <input
            type="number"
            value={additionalMoneyPerRound}
            min="0"
            onChange={(e) => setAdditionalMoneyPerRound(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Total Rounds:
          <input
            type="number"
            value={totalRounds}
            min="1"
            onChange={(e) => setTotalRounds(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Betting Time (seconds):
          <input
            type="number"
            value={bettingTime}
            min="5"
            onChange={(e) => setBettingTime(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Question Time (seconds):
          <input
            type="number"
            value={questionTime}
            min="5"
            onChange={(e) => setQuestionTime(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <button onClick={handleCreateRoom} style={{ marginTop: '20px' }}>
        Create Room
      </button>
    </div>
  );
}

export default CreateRoomPage;
