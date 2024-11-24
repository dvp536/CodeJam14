import { GameState, Player, Question } from "../data/DataTypes";

export const initializeGameState = (players: Player[], questions: Question[]): GameState => ({
  players,
  currentQuestion: null,
  roundsAmount: 5,
  bettingAmounts: players.reduce((acc, player) => {
    acc[player.id] = 0;
    return acc;
  }, {} as { [playerId: number]: number })
});

export const updateBet = (state: GameState, playerId: number, amount: number): GameState => {
  return {
    ...state,
    bettingAmounts: {
      ...state.bettingAmounts,
      [playerId]: amount
    }
  };
};

export const evaluateRound = (
  state: GameState,
  selectedAnswer: keyof Question["options"],
  playerId: number
): GameState => {
  const currentQuestion = state.currentQuestion;
  if (!currentQuestion) {
    console.warn("No current question available.");
    return state;
  }

  const isCorrect = currentQuestion.correctAnswer === selectedAnswer;
  const bet = state.bettingAmounts[playerId];
  const reward = isCorrect ? bet : -bet;

  console.log(`Player ${playerId} answered ${selectedAnswer}. Correct? ${isCorrect}`);
  console.log(`Bet: ${bet}, Reward: ${reward}`);

  return {
    ...state,
    players: state.players.map((player) =>
      player.id === playerId
        ? { ...player, money: player.money + reward }
        : player
    )
  };
};