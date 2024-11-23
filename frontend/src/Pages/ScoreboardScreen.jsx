import 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const BackButton = styled.button`
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

const Title = styled.h2`
  font-size: 24px;
  color: #333;
`;

const Scoreboard = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  background-color: #f8f9fa;
`;

const PlayerRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

function ScoreboardScreen() {
  const players = [
    { name: 'Player 1', points: 150 },
    { name: 'Player 2', points: 100 },
    { name: 'Player 3', points: 50 },
  ];

  return (
    <Container>
      <BackButton> Back </BackButton>
      <Title>Scoreboard</Title>
      <Scoreboard>
        {players.map((player, index) => (
          <PlayerRow key={index}>
            <span>{player.name}</span>
            <span>{player.points} Points</span>
          </PlayerRow>
        ))}
      </Scoreboard>
    </Container>
  );
}

export default ScoreboardScreen;
