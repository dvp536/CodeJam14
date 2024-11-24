import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateRoomPage({ socket }) {
  const [username, setUsername] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [customSubject, setCustomSubject] = useState(''); // State for custom subject input
  const [subjects, setSubjects] = useState([
    'General Knowledge',
    'Science',
    'History',
    'Sports',
    'Entertainment',
  ]); // Moved subjects into state
  const navigate = useNavigate();

  // State variables for game settings
  const [startingMoney, setStartingMoney] = useState(100);
  const [additionalMoneyPerRound, setAdditionalMoneyPerRound] = useState(25);
  const [totalRounds, setTotalRounds] = useState(5);
  const [bettingTime, setBettingTime] = useState(15);
  const [questionTime, setQuestionTime] = useState(60);

  const handleCreateRoom = () => {
    const settings = {
      startingMoney,
      additionalMoneyPerRound,
      totalRounds,
      bettingTime,
      questionTime,
    };
    socket.emit('createRoom', {
      username,
      subjects: selectedSubjects,
      settings,
    });
    socket.on('roomCreated', ({ roomId }) => {
      navigate(`/lobby?roomId=${roomId}&username=${username}`);
    });
  };

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const addCustomSubject = () => {
    const trimmedSubject = customSubject.trim();
    if (trimmedSubject && !subjects.includes(trimmedSubject)) {
      setSubjects([...subjects, trimmedSubject]);
      setCustomSubject('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-400 flex flex-col items-center justify-center text-white p-6">
      <h2 className="text-3xl font-bold mb-8">Create Room</h2>
      <div className="w-full max-w-lg bg-white text-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        {/* Username Input */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
          />
        </div>

        {/* Custom Subject Input */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Add Custom Subject
          </label>
          <div className="flex">
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring focus:ring-teal-300"
              placeholder="Enter custom subject"
            />
            <button
              onClick={addCustomSubject}
              className="bg-teal-600 text-white font-semibold px-4 py-2 rounded-r-lg hover:bg-teal-700 transition duration-300"
            >
              Add
            </button>
          </div>
        </div>

        {/* Subject Selection */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Subjects
          </label>
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={`px-4 py-2 font-semibold rounded-lg shadow-md transition-transform duration-300 ${
                  selectedSubjects.includes(subject)
                    ? 'bg-teal-600 text-white scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-teal-500 hover:text-white'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Starting Money Input */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Starting Money
          </label>
          <input
            type="number"
            value={startingMoney}
            min="1"
            onChange={(e) => setStartingMoney(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
          />
        </div>

        {/* Additional Money Per Round Input */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Additional Money Per Round
          </label>
          <input
            type="number"
            value={additionalMoneyPerRound}
            min="0"
            onChange={(e) => setAdditionalMoneyPerRound(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
          />
        </div>

        {/* Total Rounds Input */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Total Rounds
          </label>
          <input
            type="number"
            value={totalRounds}
            min="1"
            onChange={(e) => setTotalRounds(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
          />
        </div>

        {/* Betting Time Input */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Betting Time (seconds)
          </label>
          <input
            type="number"
            value={bettingTime}
            min="5"
            onChange={(e) => setBettingTime(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
          />
        </div>

        {/* Question Time Input */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Question Time (seconds)
          </label>
          <input
            type="number"
            value={questionTime}
            min="5"
            onChange={(e) => setQuestionTime(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
          />
        </div>

        {/* Create Room Button */}
        <button
          onClick={handleCreateRoom}
          className="w-full bg-teal-600 text-white font-semibold rounded-lg px-4 py-2 shadow-md hover:bg-teal-700 transition duration-300"
          disabled={!username || selectedSubjects.length === 0}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}

export default CreateRoomPage;
