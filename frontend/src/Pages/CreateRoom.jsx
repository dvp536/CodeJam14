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

function CreateRoom() {
  const navigate = useNavigate();
  const [roomTitle, setRoomTitle] = useState('');
  const [rounds, setRounds] = useState(5);
  const [defaultMoney, setDefaultMoney] = useState(100);

  const handleCreateRoom = () => {
    console.log({ roomTitle, rounds, defaultMoney });
    navigate('/game'); // Navigate to the game screen
  };

  return (
    <Container>
      <BackButton
        onClick={() => {
          navigate('/');
        }}
        > Back </BackButton>
      <Title>Create Room</Title>
      <Input
        type="text"
        placeholder="Room Title"
        value={roomTitle}
        onChange={(e) => setRoomTitle(e.target.value)}
      />
      <span>Number of rounds: </span>
      <Input
        type="number"
        placeholder="Number of Rounds"
        value={rounds}
        onChange={(e) => setRounds(parseInt(e.target.value, 10))}
      />
      <span>Default Money: </span>
      <Input
        type="number"
        placeholder="Default Money"
        value={defaultMoney}
        onChange={(e) => setDefaultMoney(parseInt(e.target.value, 10))}
      />
      <StyledButton onClick={handleCreateRoom}>Create Room</StyledButton>
    </Container>
  );
}

export default CreateRoom;
