import React from 'react';

function TutorialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-400 flex flex-col items-center justify-center text-white p-6">
      <div className="w-full max-w-lg bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-teal-600 mb-6 text-center">How to Play</h2>

        <p className="text-gray-700 text-lg mb-6">
          Welcome to the Trivia Game! Here's a step-by-step guide to get started:
        </p>

        <ul className="list-disc space-y-4 pl-6 text-gray-700 text-lg">
          <li>Choose a subject for your game when creating a room.</li>
          <li>
            The game consists of a configurable number of rounds, each with a trivia question.
          </li>
          <li>Each question has 4 multiple-choice options.</li>
          <li>You start with an adjustable amount of money (default: $100).</li>
          <li>
            Before each round, you receive an additional amount of money (default: $25).
          </li>
          <li>
            During the betting phase, you can bet an amount on the question or choose "MAX BET" to wager all your money.
          </li>
          <li>If you answer correctly, you win double your bet; if wrong, you lose the bet amount.</li>
          <li>
            After each round, the leaderboard shows the standings and whether your answer was correct.
          </li>
          <li>The player with the most money at the end of the game is declared the winner!</li>
        </ul>

        <p className="text-gray-600 text-center mt-6">
          Ready to test your knowledge and compete against others? Join or create a room now!
        </p>
      </div>
    </div>
  );
}

export default TutorialPage;
