import React, { useState } from 'react';
import './Styling/Game.css';

function Game() {
  const [question, setQuestion] = useState<string>('What is the capital of France?');
  const [answer, setAnswer] = useState<string>('');

  const handleAnswer = (selectedAnswer: string) => {
    setAnswer(selectedAnswer);
    console.log(`Answered: ${selectedAnswer}`);
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Game Screen</h2>
      <div className="game-question-box">
        <p className="game-question">{question}</p>
        <div className="game-options">
          <button onClick={() => handleAnswer('Paris')} className="game-button">
            Paris
          </button>
          <button onClick={() => handleAnswer('London')} className="game-button">
            London
          </button>
          <button onClick={() => handleAnswer('Berlin')} className="game-button">
            Berlin
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
