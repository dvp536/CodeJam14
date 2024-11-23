import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// import pages
import Page from "./Pages/Menu"
import CreateRoom from "./Pages/CreateRoom"
import WaitingRoom from "./Pages/WaitingRoom"
import JoinRoom from "./Pages/JoinRoom"
import ScoreboardScreen from './Pages/ScoreboardScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/createRoom" element={<CreateRoom />} />
        <Route path="/waitingRoom" element={<WaitingRoom />} />
        <Route path="/joinRoom" element={<JoinRoom />} />
        <Route path="/scoreboard" element={<ScoreboardScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
