import React from 'react';
import { Link } from 'react-router-dom';

function StartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-400 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Animated background decoration */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-white opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl animate-pulse-slower"></div>

      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-white mb-12 drop-shadow-lg animate-slide-in-from-left">
        Welcome to the Trivia Game!
      </h1>

      {/* Buttons */}
      <div className="space-y-6 w-full max-w-md animate-fade-in">
        <Link
          to="/create-room"
          className="block w-full text-center text-teal-600 text-lg font-bold bg-white rounded-full py-3 shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Create Room
        </Link>
        <Link
          to="/join-room"
          className="block w-full text-center text-teal-600 text-lg font-bold bg-white rounded-full py-3 shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Join Room
        </Link>
        <Link
          to="/tutorial"
          className="block w-full text-center text-teal-600 text-lg font-bold bg-white rounded-full py-3 shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          How to Play
        </Link>
      </div>

      {/* Subtle footer text */}
      <p className="text-white text-sm mt-10 opacity-90 animate-fade-in-delayed">
        Ready to test your knowledge? Let’s dive in!
      </p>
    </div>
  );
}

export default StartPage;
