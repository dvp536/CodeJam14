export interface Question {
  id: number;
  prompt: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: keyof Question["options"];
}

export interface Item {
  id: number;
  name: string;
  price: number;
  effect: string;
}

export interface Player {
  id: number;
  name: string;
  money: number;
  items: Item[];
}

export interface GameState {
  players: Player[];
  currentQuestion: Question | null;
  bettingAmounts: { [playerId: number]: number };
  roundsAmount: number;
}