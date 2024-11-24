import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-teal-500 py-4 shadow-lg">
      <div className="flex justify-center space-x-6">
        <Link
          to="/"
          className="text-teal-600 text-lg font-bold bg-white rounded-full px-6 py-3 shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Start
        </Link>
        <Link
          to="/create-room"
          className="text-teal-600 text-lg font-bold bg-white rounded-full px-6 py-3 shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Create Room
        </Link>
        <Link
          to="/join-room"
          className="text-teal-600 text-lg font-bold bg-white rounded-full px-6 py-3 shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Join Room
        </Link>
        <Link
          to="/tutorial"
          className="text-teal-600 text-lg font-bold bg-white rounded-full px-6 py-3 shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Tutorial
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
