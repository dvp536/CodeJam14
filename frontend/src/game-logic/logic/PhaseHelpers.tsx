import { GameState, Question } from "../data/DataTypes";

export const ensureAllPlayersBet = (state: GameState): GameState => {
  const updatedBets = { ...state.bettingAmounts };

  state.players.forEach((player) => {
    if (updatedBets[player.id] === 0 || isNaN(updatedBets[player.id]) || updatedBets[player.id] === undefined) {
      updatedBets[player.id] = Math.min(player.money, 50); // Auto-bet max amount capped at 50
    }
  });

  return {
    ...state,
    bettingAmounts: updatedBets
  };
};

export const moveToNextQuestion = (
  state: GameState,
  currentQuestionIndex: number,
  questions: Question[]
): { newState: GameState; newIndex: number } => {
  const newIndex = currentQuestionIndex + 1;
  if (newIndex >= questions.length) {
    return { newState: { ...state, currentQuestion: null }, newIndex: currentQuestionIndex };
  }

  return {
    newState: {
      ...state,
      currentQuestion: questions[newIndex],
      bettingAmounts: state.players.reduce((acc, player) => {
        acc[player.id] = 0; // Reset betting amounts
        return acc;
      }, {} as { [playerId: number]: number })
    },
    newIndex
  };
};