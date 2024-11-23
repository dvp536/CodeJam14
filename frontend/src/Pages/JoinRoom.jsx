import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e7e34;
  }
`;

function JoinRoom() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  const handleJoinRoom = () => {
    console.log({ roomCode });
    navigate('/waiting'); // Navigate to a waiting screen before game starts
  };

  return (
    <Container>
      <Title>Join Room</Title>
      <Input
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <StyledButton onClick={handleJoinRoom}>Join Room</StyledButton>
    </Container>
  );
}

export default JoinRoom;
