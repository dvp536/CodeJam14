# CodeJam14 - Trivia Betting Game

Welcome to our project for **CodeJam14**! This repository contains the code for our **Trivia Betting Game**, a fun and interactive multiplayer game where players can bet on their knowledge across various subjects.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Gameplay](#gameplay)
- [License](#license)

## Introduction

Our project for **CodeJam14** is an online multiplayer trivia game that combines the excitement of betting with the challenge of trivia questions. Players can join rooms, place bets on their knowledge of upcoming questions, and compete against others to climb the leaderboard.

## Features

- **Multiplayer Rooms**: Create or join rooms to play with friends or other players.
- **Betting System**: Place bets on your confidence level before each question.
- **Diverse Subjects**: Questions span across various subjects to test your knowledge.
- **Real-Time Gameplay**: Experience smooth and interactive gameplay with real-time updates.
- **Leaderboards**: Compete to reach the top of the leaderboard after each round.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Invite Friends**: Share room links or QR codes to invite friends easily.
- **Visual Feedback**: Get instant feedback on your answers and see your progress.
- **Mobile Navigation**: Easy-to-use navigation optimized for mobile devices.

## Technologies Used

- **Frontend**:
  - React
  - Tailwind CSS
  - Socket.io-client

- **Backend**:
  - Node.js
  - Express.js
  - Socket.io

- **Miscellaneous**:
  - Vite (for frontend build tooling)
  - TypeScript

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v16 or later)
- **npm** or **yarn** for package management
- **Git** for version control
- A **browser** for accessing the app

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dvp536/CodeJam14.git
   cd CodeJam14
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     VITE_APP_SOCKET_URL=http://localhost:5000
     PORT=5000
     OPENAI_API_KEY=your_api_key
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```


5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

### Running the Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run start
   ```

   The backend server will run on `http://localhost:5000`.

---

## Gameplay

### How to Play

#### Create or Join a Room
- **Create Room**: Start a new game and share the invite link or QR code with friends.
- **Join Room**: Enter an existing room using the room ID or invite link.

#### Betting Phase
- **Place Your Bet**: Before each question, bet a portion of your in-game money based on your confidence.
- **Bet Options**: Choose from predefined percentages (25%, 50%, 75%, 100%) or enter a custom amount.

#### Question Phase
- **Answer Questions**: Answer multiple-choice trivia questions within the time limit.
- **Subjects Announced**: Know the subject beforehand to strategize your bet.

#### Leaderboard Phase
- **View Results**: See if you got the answer right or wrong.
- **Correct Answer Revealed**: The correct answer is displayed for learning purposes.
- **Leaderboard Update**: Check your ranking compared to other players.
- **Highlighting**: Your entry is highlighted to easily identify your position.
- **First Place Animation**: Special animation if you're leading the game!

#### Game Over
- **Final Standings**: After all rounds, view the final leaderboard.
- **Winner Announcement**: Celebrate the winner of the game.
- **Play Again**: Option to return to the home screen and start a new game.

---

### Controls and Navigation

- **Desktop Navigation**: Accessible at the top of the screen for easy access.
- **Mobile Navigation**: Fixed at the bottom with icons for quick navigation.
- **Responsive Design**: The game adjusts seamlessly to different screen sizes.

---

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

