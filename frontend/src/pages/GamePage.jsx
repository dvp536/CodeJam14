// src/pages/GamePage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function GamePage({ socket }) {
    const [phase, setPhase] = useState('betting'); // 'betting', 'question', 'results'
    const [timer, setTimer] = useState(0);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [betAmount, setBetAmount] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [playerMoney, setPlayerMoney] = useState(100);
    const [playersInfo, setPlayersInfo] = useState([]);
    const [round, setRound] = useState(1);
    const totalRounds = 5;

    const query = new URLSearchParams(useLocation().search);
    const roomId = query.get('roomId');
    const username = query.get('username');

    useEffect(() => {
        // Handle betting phase
        socket.on('bettingPhase', (data) => {
            setPhase('betting');
            setRound(data.round);
            setPlayersInfo(data.money);
            setPlayerMoney(
                data.money.find((p) => p.username === username)?.money || 100
            );
            setTimer(15);
        });

        // Handle question phase
        socket.on('questionPhase', (data) => {
            setPhase('question');
            setQuestion(data.question);
            setOptions(data.options);
            setTimer(60);
            setSelectedAnswer('');
            setBetAmount(0);
        });

        // Handle round ended
        socket.on('roundEnded', (data) => {
            setPhase('results');
            setPlayersInfo(data.players);
            setPlayerMoney(
                data.players.find((p) => p.username === username)?.money || playerMoney
            );
            alert(`Round ended. Correct Answer: ${data.correctAnswer}`);
        });

        // Handle game over
        socket.on('gameOver', ({ winner }) => {
            if (winner.username === username) {
                alert(`Congratulations! You won the game with $${winner.money}!`);
            } else {
                alert(`Game Over! Winner is ${winner.username} with $${winner.money}`);
            }
        });

        // Timer countdown
        let timerInterval = null;
        if (timer > 0) {
            timerInterval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => {
            socket.off('bettingPhase');
            socket.off('questionPhase');
            socket.off('roundEnded');
            socket.off('gameOver');
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [socket, timer, username, playerMoney]);

    // Place bet
    const handlePlaceBet = () => {
        if (betAmount <= 0 || betAmount > playerMoney) {
            alert('Invalid bet amount.');
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
            {phase === 'betting' && (
                <>
                    <h3>Betting Phase</h3>
                    <p>Place your bet:</p>
                    <input
                        type="number"
                        value={betAmount}
                        min="1"
                        max={playerMoney}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                    />
                    <button onClick={handlePlaceBet}>Place Bet</button>
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
            {(phase === 'betting' || phase === 'question') && (
                <>
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
        </div>
    );
}

export default GamePage;
