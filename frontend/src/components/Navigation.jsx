import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlus, FaSignInAlt, FaBook, FaStore } from 'react-icons/fa';

function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:relative md:top-0 bg-gray-100 shadow-lg">
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center space-x-6 py-4">
        <Link
          to="/"
          className="text-teal-600 text-lg font-bold bg-gray-50 rounded-full px-6 py-3 shadow-md hover:bg-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Start
        </Link>
        <Link
          to="/create-room"
          className="text-teal-600 text-lg font-bold bg-gray-50 rounded-full px-6 py-3 shadow-md hover:bg-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Create Room
        </Link>
        <Link
          to="/join-room"
          className="text-teal-600 text-lg font-bold bg-gray-50 rounded-full px-6 py-3 shadow-md hover:bg-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Join Room
        </Link>
        <Link
          to="/tutorial"
          className="text-teal-600 text-lg font-bold bg-gray-50 rounded-full px-6 py-3 shadow-md hover:bg-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Tutorial
        </Link>
        <Link
          to="/item-store"
          className="text-teal-600 text-lg font-bold bg-gray-50 rounded-full px-6 py-3 shadow-md hover:bg-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Item Store
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-around items-center py-3 bg-gray-100 shadow-lg">
        <Link
          to="/"
          className="flex flex-col items-center text-teal-600 hover:text-teal-800 transition-colors duration-300"
        >
          <FaHome className="text-2xl" />
          <span className="text-sm font-semibold">Start</span>
        </Link>
        <Link
          to="/create-room"
          className="flex flex-col items-center text-teal-600 hover:text-teal-800 transition-colors duration-300"
        >
          <FaPlus className="text-2xl" />
          <span className="text-sm font-semibold">Create</span>
        </Link>
        <Link
          to="/join-room"
          className="flex flex-col items-center text-teal-600 hover:text-teal-800 transition-colors duration-300"
        >
          <FaSignInAlt className="text-2xl" />
          <span className="text-sm font-semibold">Join</span>
        </Link>
        <Link
          to="/tutorial"
          className="flex flex-col items-center text-teal-600 hover:text-teal-800 transition-colors duration-300"
        >
          <FaBook className="text-2xl" />
          <span className="text-sm font-semibold">Tutorial</span>
        </Link>
        <Link
          to="/item-store"
          className="flex flex-col items-center text-teal-600 hover:text-teal-800 transition-colors duration-300"
        >
          <FaStore className="text-2xl" />
          <span className="text-sm font-semibold">Store</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
