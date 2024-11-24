import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function GamePage({ socket }) {
  const [phase, setPhase] = useState('betting'); // 'betting', 'question', 'results', 'waiting'
  const [timer, setTimer] = useState(0);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [betAmount, setBetAmount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [playerMoney, setPlayerMoney] = useState(100);
  const [playersInfo, setPlayersInfo] = useState([]);
  const [round, setRound] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalRounds, setTotalRounds] = useState(5);

  const query = new URLSearchParams(useLocation().search);
  const roomId = query.get('roomId');
  const username = query.get('username');
  const navigate = useNavigate();

  // Event handlers
  const handleBettingPhase = (data) => {
    setPhase('betting');
    setRound(data.round);
    setTotalRounds(data.totalRounds); // Update totalRounds
    setPlayersInfo(data.money);
    setPlayerMoney(
      data.money.find((p) => p.username === username)?.money || playerMoney
    );
    setTimer(data.bettingTime || 15);
    setBetAmount(null);
    setErrorMessage('');
  };

  const handleQuestionPhase = (data) => {
    setPhase('question');
    setQuestion(data.question);
    setOptions(data.options);
    setTimer(data.questionTime || 60); // Use the question time from the server
    setSelectedAnswer('');
    setErrorMessage('');
  };

  const handleRoundEnded = (data) => {
    setPhase('results');
    setPlayersInfo(data.players);
    setPlayerMoney(
      data.players.find((p) => p.username === username)?.money || playerMoney
    );
    alert(`Round ended. Correct Answer: ${data.correctAnswer}`);
  };

  const handleGameOver = ({ winner, players }) => {
    navigate('/game-over', { state: { winner, players } });
  };

  const handleError = ({ message }) => {
    setErrorMessage(message);
    setPhase('betting'); // Allow the player to try placing the bet again
  };

  // Attach event handlers
  useEffect(() => {
    // Attach event handlers
    socket.on('bettingPhase', handleBettingPhase);
    socket.on('questionPhase', handleQuestionPhase);
    socket.on('roundEnded', handleRoundEnded);
    socket.on('gameOver', handleGameOver);
    socket.on('error', handleError);

    // Emit 'playerReady' after event handlers are set up
    socket.emit('playerReady', { roomId });

    // Cleanup
    return () => {
      socket.off('bettingPhase', handleBettingPhase);
      socket.off('questionPhase', handleQuestionPhase);
      socket.off('roundEnded', handleRoundEnded);
      socket.off('gameOver', handleGameOver);
      socket.off('error', handleError);
    };
  }, [socket, roomId]);

  // Timer countdown
  useEffect(() => {
    let timerInterval = null;
    if (timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timer]);

  // Handle timer reaching zero
  useEffect(() => {
    if (timer === 0) {
      if (phase === 'betting') {
        handleBettingTimeUp();
      } else if (phase === 'question') {
        handleQuestionTimeUp();
      }
    }
  }, [timer, phase]);

  const handleBettingTimeUp = () => {
    if (betAmount === null || betAmount === undefined) {
      setBetAmount(0);
      socket.emit('placeBet', { roomId, betAmount: 0 });
    }
    setPhase('waiting');
  };

  const handleQuestionTimeUp = () => {
    if (selectedAnswer === '') {
      socket.emit('submitAnswer', { roomId, answer: null });
    }
    setPhase('waiting');
  };

  // Place bet
  const handlePlaceBet = () => {
    if (betAmount < 0 || betAmount > playerMoney) {
      setErrorMessage('Invalid bet amount.');
      return;
    }
    socket.emit('placeBet', { roomId, betAmount });
    setPhase('waiting');
  };

  // Submit answer
  const handleSubmitAnswer = () => {
    if (selectedAnswer === '') {
      alert('Please select an answer.');
      return;
    }
    socket.emit('submitAnswer', { roomId, answer: selectedAnswer });
    setPhase('waiting');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>
        Round {round} of {totalRounds}
      </h2>
      <p>Money: ${playerMoney}</p>
      <p>Timer: {timer} seconds</p>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {phase === 'betting' && (
        <>
          <h3>Betting Phase</h3>
          <p>Place your bet:</p>
          <input
            type="number"
            value={betAmount !== null ? betAmount : ''}
            min="0"
            max={playerMoney}
            onChange={(e) => setBetAmount(Number(e.target.value))}
          />
          <button onClick={handlePlaceBet}>Place Bet</button>
          <h3>Players' Money</h3>
          <ul>
            {playersInfo.map((player) => (
              <li key={player.username}>
                {player.username}: ${player.money}
              </li>
            ))}
          </ul>
        </>
      )}
      {phase === 'question' && (
        <>
          <h3>Question Phase</h3>
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
          <button onClick={handleSubmitAnswer}>Submit Answer</button>
        </>
      )}
      {phase === 'waiting' && <p>Waiting for other players...</p>}
      {phase === 'results' && (
        <>
          <h3>Round Results</h3>
          <ul>
            {playersInfo.map((player) => (
              <li key={player.username}>
                {player.username}: ${player.money}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default GamePage;
