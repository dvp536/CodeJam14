import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function GamePage({ socket }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [betAmount, setBetAmount] = useState(50);
  const [playerMoney, setPlayerMoney] = useState(100);
  const [round, setRound] = useState(1);
  const totalRounds = 5;

  const query = new URLSearchParams(useLocation().search);
  const roomId = query.get('roomId');
  const username = query.get('username');

  useEffect(() => {
    socket.emit('startGame', { roomId });

    socket.on('newRound', (data) => {
      setQuestion(data.question);
      setOptions(data.options);
      setRound(data.round);
      setSelectedAnswer('');
      setBetAmount(50); // Reset bet amount each round
    });

    socket.on('gameOver', ({ winner }) => {
      alert(`Game Over! Winner is ${winner.username} with $${winner.money}`);
    });

    return () => {
      socket.off('newRound');
      socket.off('gameOver');
    };
  }, [socket, roomId]);

  const handleSubmitAnswer = () => {
    if (selectedAnswer === '') {
      alert('Please select an answer.');
      return;
    }

    socket.emit('submitAnswer', { roomId, answer: selectedAnswer, betAmount });

    // Update player's money locally (This should ideally come from the server)
    setPlayerMoney((prevMoney) => prevMoney - betAmount);

    socket.on('answerResult', ({ isCorrect }) => {
      if (isCorrect) {
        setPlayerMoney((prevMoney) => prevMoney + betAmount * 2);
        alert('Correct! You won.');
      } else {
        alert('Incorrect! You lost.');
      }
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>
        Round {round} of {totalRounds}
      </h2>
      <p>Money: ${playerMoney}</p>
      <p>{question}</p>
      <div>
        {options.map((option) => (
          <div key={option}>
            <label>
              <input
                type="radio"
                name="answer"
                value={option.charAt(0)} // 'A', 'B', 'C', 'D'
                checked={selectedAnswer === option.charAt(0)}
                onChange={(e) => setSelectedAnswer(e.target.value)}
              />
              {option}
            </label>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Bet Amount:
          <input
            type="number"
            value={betAmount}
            min="1"
            max={playerMoney}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <button onClick={handleSubmitAnswer} style={{ marginTop: '20px' }}>
        Submit Answer
      </button>
    </div>
  );
}

export default GamePage;
