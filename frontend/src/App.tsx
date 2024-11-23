import React, { useState } from "react";
import { initializeGameState, updateBet, evaluateRound } from "../src/game-logic/logic/GameLogic";
import { Player, Question } from "../src/game-logic/data/DataTypes";
import ItemSelection from "./game-logic/components/ItemSelection";
import BettingPhase from "./game-logic/components/BettingPhase";
import { mockQuestions, mockItems } from "../src/game-logic/data/MockData";
import { ensureAllPlayersBet, moveToNextQuestion } from "./game-logic/logic/PhaseHelpers";

import {
  handleBet,
  handleItemPurchase,
  moveToReviewBetsPhase,
  moveToQuestionsPhase,
} from "./game-logic/logic/GameHandlers";
import BettingScreen from "./game-logic/components/BettingScreen";
import ReviewBetsScreen from "./game-logic/components/ReviewBetsScreen";
import QuestionScreen from "./game-logic/components/QuestionScreen";

const App: React.FC = () => {
  const initialPlayers: Player[] = [
    { id: 1, name: "Player 1", money: 100, items: [] },
    { id: 2, name: "Player 2", money: 100, items: [] },
    { id: 3, name: "Player 3", money: 100, items: [] },
    { id: 4, name: "Player 4", money: 100, items: [] },
  ];

  const [gameState, setGameState] = useState(() =>
    initializeGameState(initialPlayers, mockQuestions)
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<"betting" | "reviewBets" | "questions">("betting");
  const [currentTurn, setCurrentTurn] = useState(0);

  const handleBetting = (playerId: number, amount: number) => {
    setGameState((prevState) => handleBet(prevState, playerId, amount));
  };

  const handlePurchase = (playerId: number, itemId: number) => {
    const item = mockItems.find((item) => item.id === itemId);
    if (!item) return;
    setGameState((prevState) => handleItemPurchase(prevState, playerId, item));
  };

  const startReviewBetsPhase = () => {
    setGameState((prevState) => moveToReviewBetsPhase(prevState));
    setCurrentPhase("reviewBets");
  };

  const startQuestionsPhase = () => {
    setGameState((prevState) =>
      moveToQuestionsPhase(prevState, currentQuestionIndex, mockQuestions)
    );
    setCurrentPhase("questions");
  };

  const handleAnswer = (playerId: number, selectedOption: keyof Question["options"]) => {
    // Evaluate the current player's answer
    setGameState((prevState) => {
      const updatedState = evaluateRound(prevState, selectedOption, playerId);
  
      return updatedState; // Return the updated state for React to update
    });
  
    // Handle turn and phase transitions
    if (currentTurn < gameState.players.length - 1) {
      setCurrentTurn((prevTurn) => prevTurn + 1); // Move to the next player's turn
    } else {
      // End of the question round, transition to the next question
      const { newState, newIndex } = moveToNextQuestion(gameState, currentQuestionIndex, mockQuestions);
  
      setGameState(newState); // Update game state for the next question
      setCurrentQuestionIndex(newIndex);
      setCurrentTurn(0);
  
      // If there are no more questions, handle game over logic
      if (newIndex >= mockQuestions.length) {
        console.log("Game Over! All questions answered.");
        // Optionally, set a new phase like 'gameOver'
      } else {
        setCurrentPhase("betting"); // Transition back to betting phase
      }
    }
  };

  return (
    <div>
      <h1>Kahoot Mario Party - Testing Mode</h1>
      {currentPhase === "betting" && (
        <BettingScreen
          players={gameState.players}
          onItemPurchase={handlePurchase}
          onBet={handleBetting}
          onLockInBet={startReviewBetsPhase}
        />
      )}
      {currentPhase === "reviewBets" && (
        <ReviewBetsScreen
          players={gameState.players}
          bettingAmounts={gameState.bettingAmounts}
          onStartQuestions={startQuestionsPhase}
        />
      )}
      {currentPhase === "questions" && gameState.currentQuestion && (
        <QuestionScreen
        currentPlayer={gameState.players[currentTurn]}
        question={gameState.currentQuestion}
        onAnswer={(option) => handleAnswer(gameState.players[currentTurn].id, option)}
      />
      )}
    </div>
  );
};

export default App;