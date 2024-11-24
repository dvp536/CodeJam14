import React from 'react';

function TutorialPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Tutorial</h2>
      <p>Welcome to the Trivia Game! Here's how to play:</p>
      <ul>
        <li>Choose a subject for your game.</li>
        <li>The game has 5 rounds, each with a trivia question.</li>
        <li>Questions are multiple-choice with 4 options.</li>
        <li>You start with $100 and receive $50 before each round.</li>
        <li>Bet an amount before answering; if correct, you win double your bet.</li>
        <li>The player with the most money at the end wins!</li>
      </ul>
    </div>
  );
}

export default TutorialPage;
