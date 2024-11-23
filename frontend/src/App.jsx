import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// import pages
import Home from "./Pages/Home"
import CreateRoom from "./Pages/CreateRoom"
import JoinRoom from "./Pages/JoinRoom"
import ScoreboardScreen from './Pages/ScoreboardScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createRoom" element={<CreateRoom />} />
        <Route path="/joinRoom" element={<JoinRoom />} />
        <Route path="/scoreboard" element={<ScoreboardScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
