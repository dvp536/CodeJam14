import 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Styled components for consistent styling
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
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

  &.multiplayerButton {
    background-color: #28a745;

    &:hover {
      background-color: #1e7e34;
    }
  }
`;

const Paragraph = styled.p`
  font-size: 16px;
  color: #666;
`;

// Menu component
function Menu() {
  const navigate = useNavigate();

  const CreateRoom = () => {
    console.log('Creating a new room...');
    navigate('/createRoom');
  };

  const JoinRoom = () => {
    console.log('Opening Multiplayer Lobby...');
  };

  return (
    <Container>
      <Title>Main Menu</Title> 
      <Paragraph>Welcome to the Trivia Game! Choose an option below:</Paragraph>
      <StyledButton onClick={CreateRoom}>Create Room</StyledButton>
      <StyledButton onClick={JoinRoom} className="multiplayerButton">
        Multiplayer Lobby
      </StyledButton>
    </Container>
  );
}

export default Menu;
