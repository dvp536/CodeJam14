import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const QuestionBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  max-width: 600px;
  text-align: center;
  background-color: #f8f9fa;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

function Game() {
  const [question, setQuestion] = useState('What is the capital of France?');
  const [answer, setAnswer] = useState("");

  const handleAnswer = (selectedAnswer: string) => {
    setAnswer(selectedAnswer)
    console.log(`Answered: ${selectedAnswer}`);
  };

  return (
    <Container>
      <Title>Game Screen</Title>
      <QuestionBox>
        <p>{question}</p>
        <StyledButton onClick={() => handleAnswer('Paris')}>Paris</StyledButton>
        <StyledButton onClick={() => handleAnswer('London')}>London</StyledButton>
        <StyledButton onClick={() => handleAnswer('Berlin')}>Berlin</StyledButton>
      </QuestionBox>
    </Container>
  );
}

export default Game;
