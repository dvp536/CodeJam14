import { GameState, Question } from "../data/DataTypes";
import { ensureAllPlayersBet, moveToNextQuestion } from "./PhaseHelpers";
import { evaluateRound } from "./GameLogic";

export const handleBet = (gameState: GameState, playerId: number, amount: number) => ({
  ...gameState,
  bettingAmounts: {
    ...gameState.bettingAmounts,
    [playerId]: amount,
  },
});

export const handleItemPurchase = (gameState: GameState, playerId: number, item: any) => ({
  ...gameState,
  players: gameState.players.map((player) =>
    player.id === playerId && player.money >= item.price
      ? { ...player, money: player.money - item.price, items: [...player.items, item] }
      : player
  ),
});

export const moveToReviewBetsPhase = (gameState: GameState) => ensureAllPlayersBet(gameState);

export const moveToQuestionsPhase = (gameState: GameState, currentQuestionIndex: number, questions: Question[]) => ({
  ...gameState,
  currentQuestion: questions[currentQuestionIndex],
});

