import React from "react";
import { Player, Question } from "../data/DataTypes";

interface QuestionScreenProps {
    currentPlayer: { id: number; name: string };
    question: Question;
    onAnswer: (selectedOption: keyof Question["options"]) => void;
  }
  
  const QuestionScreen: React.FC<QuestionScreenProps> = ({ currentPlayer, question, onAnswer }) => {
    return (
      <div>
        <h2>{currentPlayer.name}'s Turn</h2>
        <h3>{question.prompt}</h3>
        <div>
          {Object.keys(question.options).map((key) => (
            <button
              key={`option-${key}`} // Adding a unique key for each button
              onClick={() => onAnswer(key as keyof Question["options"])}
            >
              {question.options[key as keyof Question["options"]]}
            </button>
          ))}
        </div>
      </div>
    );
  };

export default QuestionScreen;