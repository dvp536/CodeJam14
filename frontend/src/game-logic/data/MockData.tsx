import { Item, Question } from "./DataTypes";

export const mockQuestions: Question[] = [
  {
    id: 1,
    prompt: "What is the capital of France?",
    options: {
      a: "Paris",
      b: "Berlin",
      c: "Rome",
      d: "Madrid",
    },
    correctAnswer: "a",
  },
  {
    id: 2,
    prompt: "Who wrote '1984'?",
    options: {
      a: "George Orwell",
      b: "J.K. Rowling",
      c: "Ernest Hemingway",
      d: "Mark Twain",
    },
    correctAnswer: "a",
  },
];

export const mockItems: Item[] = [
  {
    id: 1,
    name: "Double Points",
    price: 50,
    effect: "Doubles the points for a correct answer",
  },
  {
    id: 2,
    name: "Steal 20 Coins",
    price: 100,
    effect: "Steals 20 coins from another player",
  },
];
