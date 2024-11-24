import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaDollarSign, FaClock } from 'react-icons/fa';

function GamePage({ socket }) {
  const [phase, setPhase] = useState('betting'); // 'betting', 'question', 'leaderboard', 'waiting'
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
  const [notification, setNotification] = useState('');
  const [leaderboardTimer, setLeaderboardTimer] = useState(10);
  const [isCorrect, setIsCorrect] = useState(false);
  const [subject, setSubject] = useState(''); // New state for the subject
  const [correctAnswer, setCorrectAnswer] = useState('');

  const query = new URLSearchParams(useLocation().search);
  const roomId = query.get('roomId');
  const username = query.get('username');
  const navigate = useNavigate();

  // Event handlers
  const handleBettingPhase = (data) => {
    setPhase('betting');
    setRound(data.round);
    setTotalRounds(data.totalRounds);
    setPlayersInfo(data.money);
    setPlayerMoney(
      data.money.find((p) => p.username === username)?.money || playerMoney
    );
    setTimer(data.bettingTime || 15);
    setBetAmount(null);
    setErrorMessage('');
    setNotification('');
    setSubject(data.subject || ''); // Set the subject
  };

  const handleQuestionPhase = (data) => {
    setPhase('question');
    setQuestion(data.question);
    setOptions(data.options);
    setTimer(data.questionTime || 60);
    setSelectedAnswer('');
    setErrorMessage('');
    setNotification('');
  };

  const handleRoundEnded = (data) => {
    setPhase('leaderboard');
    setIsCorrect(data.isCorrect);
    setPlayersInfo(data.players);
    setPlayerMoney(
      data.players.find((p) => p.username === username)?.money || playerMoney
    );
    setLeaderboardTimer(10); // Reset leaderboard timer to 10 seconds
  };

  const handleLeaderboardPhase = (data) => {
    setPhase('leaderboard');
    setRound(data.round);
    setTotalRounds(data.totalRounds);
    setPlayersInfo(data.players);
    setCorrectAnswer(data.correctAnswer || ''); // Set the correct answer
    setIsCorrect(
      data.players.find((p) => p.username === username)?.isCorrect
    );
    setPlayerMoney(
      data.players.find((p) => p.username === username)?.money || playerMoney
    );
    setLeaderboardTimer(data.leaderboardTime || 10);
  };

  const handleGameOver = ({ winner, players }) => {
    navigate('/game-over', { state: { winner, players } });
  };

  const handleError = ({ message }) => {
    setErrorMessage(message);
    setPhase('betting');
  };

  useEffect(() => {
    console.log(`Phase changed to: ${phase}`);
  }, [phase]);

  useEffect(() => {
    console.log(`Timer: ${timer}, Leaderboard Timer: ${leaderboardTimer}`);
  }, [timer, leaderboardTimer]);

  // Attach event handlers
  useEffect(() => {
    socket.on('bettingPhase', handleBettingPhase);
    socket.on('questionPhase', handleQuestionPhase);
    socket.on('leaderboardPhase', handleLeaderboardPhase);
    socket.on('roundEnded', handleRoundEnded);
    socket.on('gameOver', handleGameOver);
    socket.on('error', handleError);

    socket.emit('playerReady', { roomId });

    return () => {
      socket.off('bettingPhase', handleBettingPhase);
      socket.off('questionPhase', handleQuestionPhase);
      socket.off('leaderboardPhase', handleLeaderboardPhase);
      socket.off('roundEnded', handleRoundEnded);
      socket.off('gameOver', handleGameOver);
      socket.off('error', handleError);
    };
  }, [socket, roomId]);

  // Timer countdown
  useEffect(() => {
    let timerInterval = null;

    if (phase === 'betting' || phase === 'question') {
      if (timer > 0) {
        timerInterval = setInterval(() => {
          setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
      }
    } else if (phase === 'leaderboard') {
      if (leaderboardTimer > 0) {
        timerInterval = setInterval(() => {
          setLeaderboardTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
      }
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timer, leaderboardTimer, phase]);

  // Handle timer reaching zero
  useEffect(() => {
    if (phase === 'betting' && timer === 0) {
      handleBettingTimeUp();
    } else if (phase === 'question' && timer === 0) {
      handleQuestionTimeUp();
    } else if (phase === 'leaderboard' && leaderboardTimer === 0) {
      handleLeaderboardTimeUp();
    }
  }, [timer, leaderboardTimer, phase]);

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

  const handleLeaderboardTimeUp = () => {
    setPhase('waiting');
  };

  const handlePlaceBet = () => {
    if (betAmount < 0 || betAmount > playerMoney) {
      setErrorMessage('Invalid bet amount.');
      return;
    }
    socket.emit('placeBet', { roomId, betAmount });
    setPhase('waiting');
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === '') {
      setNotification('Please select an answer!');
      return;
    }
    socket.emit('submitAnswer', { roomId, answer: selectedAnswer });
    setPhase('waiting');
  };

  const getTimerClass = (time) =>
    time > 0 && time <= 10 ? 'bg-red-600 animate-pulse' : 'bg-teal-600';

  const getCorrectOptionText = () => {
    const index = letterToIndex[correctAnswer];
    if (index !== undefined && options[index]) {
      return options[index];
    }
    return '';
  };

  const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-400 flex flex-col items-center justify-center text-white p-6">
      {/* Notification Banner */}
      {notification && (
        <div className="w-full max-w-lg mb-4 p-4 bg-teal-600 text-white font-semibold rounded-lg shadow-md">
          {notification}
        </div>
      )}

      <div className="w-full max-w-lg bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-teal-600 mb-4">
          Round {round} of {totalRounds}
        </h2>

        {/* Timer and Money */}
        <div
          className={`flex justify-between items-center text-white font-semibold rounded-lg px-6 py-4 shadow-lg mb-6 ${getTimerClass(
            timer
          )}`}
        >
          <div className="flex items-center space-x-4">
            <FaDollarSign className="text-2xl" />
            <p className="text-xl">Money: ${playerMoney}</p>
          </div>
          <div className="flex items-center space-x-4">
            <FaClock className="text-2xl" />
            <p className="text-xl">Timer: {timer}s</p>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-500 font-medium mb-4">{errorMessage}</p>
        )}

        {phase === 'betting' && (
          <>
            <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">
              Betting Phase
            </h3>
            {/* Announce the subject */}
            <div className="mb-6">
              <p className="text-lg text-gray-800 font-semibold text-center">
                <span className="text-teal-600">Upcoming Subject:</span> {subject}
              </p>
            </div>

            <p className="mb-4 text-center">Choose your bet amount:</p>

            {/* Percentage Bet Amounts */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[25, 50, 75, 100].map((percentage) => {
                const calculatedAmount = Math.floor((percentage / 100) * playerMoney);
                return (
                  <button
                    key={percentage}
                    onClick={() => setBetAmount(calculatedAmount)}
                    className={`px-4 py-2 font-semibold rounded-lg shadow-md transition-transform duration-300 ${betAmount === calculatedAmount
                      ? 'bg-teal-700 text-white scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-teal-600 hover:text-white'
                      }`}
                  >
                    {percentage}% (${calculatedAmount})
                  </button>
                );
              })}
            </div>


            {/* Custom Bet Input */}
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={betAmount !== null ? betAmount : ''}
                min="0"
                max={playerMoney}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                placeholder="Custom Amount"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
              />
              <button
                onClick={handlePlaceBet}
                className="bg-teal-600 text-white font-semibold rounded-lg px-4 py-2 shadow-md hover:bg-teal-700 transition duration-300"
              >
                Place Bet
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 font-medium mt-4">{errorMessage}</p>
            )}

            {/* Players' Money */}
            <h3 className="text-lg font-bold text-gray-700 mt-6">
              Players' Money
            </h3>
            <ul className="space-y-2">
              {playersInfo.map((player) => (
                <li
                  key={player.username}
                  className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 shadow-sm"
                >
                  {player.username}: ${player.money}
                </li>
              ))}
            </ul>
          </>
        )}

        {phase === 'question' && (
          <>
            <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">
              Question Phase
            </h3>
            <p className="text-lg text-gray-600 mb-6 text-center">
              {question}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => setSelectedAnswer(option.charAt(0))}
                  className={`p-6 border-2 rounded-lg shadow-md transform transition-transform duration-300 cursor-pointer ${selectedAnswer === option.charAt(0)
                    ? 'bg-teal-600 text-white scale-105 border-teal-800'
                    : 'bg-white text-gray-700 hover:scale-105 hover:shadow-lg'
                    }`}
                >
                  <p className="text-xl font-semibold">{option}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmitAnswer}
              className="w-full bg-teal-600 text-white font-semibold rounded-lg px-4 py-2 shadow-md hover:bg-teal-700 transition duration-300 mt-6"
            >
              Submit Answer
            </button>
          </>
        )}

        {phase === 'leaderboard' && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Round {round} Results
            </h3>
            <p
              className={`text-lg font-semibold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {isCorrect ? 'You got it right!' : 'You got it wrong.'}
            </p>
            {/* Display the correct answer */}
            <p className="text-gray-800 font-medium mb-2">
              The correct answer was:
            </p>
            <div
              className={`p-6 border-2 rounded-lg shadow-md ${isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                }  mb-4`}
            >
              <p className="text-xl font-semibold">{getCorrectOptionText()}</p>
            </div>
            <h4 className="text-lg font-bold text-gray-700 mb-2">
              Leaderboard
            </h4>
            <ul className="space-y-2 mb-4">
              {playersInfo
                .sort((a, b) => b.money - a.money)
                .map((player, index) => (
                  <li
                    key={player.username}
                    className="flex justify-between px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 shadow-sm"
                  >
                    <span>
                      {index + 1}. {player.username}
                    </span>
                    <span>${player.money}</span>
                  </li>
                ))}
            </ul>
            <p className="text-gray-600 font-medium mb-4">
              Next round starting in {leaderboardTimer} seconds...
            </p>
          </div>
        )}

        {phase === 'waiting' && (
          <p className="text-gray-600 font-medium">
            Waiting for other players...
          </p>
        )}

        {phase === 'results' && (
          <>
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Round Results
            </h3>
            <ul className="space-y-2">
              {playersInfo.map((player) => (
                <li
                  key={player.username}
                  className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 shadow-sm"
                >
                  {player.username}: ${player.money}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default GamePage;
