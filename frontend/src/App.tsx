import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Import pages
import Page from "./Pages/Menu";
import CreateRoom from "./Pages/CreateRoom";
import WaitingRoom from "./Pages/WaitingRoom";
import JoinRoom from "./Pages/JoinRoom";
import ScoreboardScreen from "./Pages/ScoreboardScreen";

// Import GameComponent
import GameComponent from "../src/game-logic/MainGame";

// Import mock data for GameComponent
import { mockQuestions, mockItems } from "../src/game-logic/data/MockData";
import { Player } from "../src/game-logic/data/DataTypes";

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/createRoom" element={<CreateRoom />} />
        <Route path="/waitingRoom" element={<WaitingRoom />} />
        <Route path="/joinRoom" element={<JoinRoom />} />
        <Route path="/scoreboard" element={<ScoreboardScreen />} />
        {/* Add GameComponent as a route */}
        <Route
          path="/game"
          element={
            <GameComponent
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;