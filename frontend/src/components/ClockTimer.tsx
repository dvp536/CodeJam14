import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number; // Initial time in seconds
}

function Timer({ initialTime }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // Function to add time
  const addTime = (seconds: number) => {
    setTimeLeft((prev) => prev + seconds);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup timer on unmount
    }
  }, [timeLeft]);

  // Convert timeLeft to minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate rotation angle for the clock hand based on the time left
  const rotation = (timeLeft / initialTime) * 360;

  // Generate tick marks (dashes) inside the clock
  const tickMarks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 360) / 60; // Angle for each tick mark
    const isMajor = i % 5 === 0; // Major ticks for every 5th mark
    return (
      <div
        key={i}
        className="absolute bg-black"
        style={{
          width: isMajor ? '3px' : '1px', // Wider for major ticks
          height: isMajor ? '12px' : '6px', // Longer for major ticks
          transform: `rotate(${angle}deg) translate(0, -70px)`, // Adjusted position closer to center
          transformOrigin: 'center',
        }}
      ></div>
    );
  });

  return (
    <div className="flex flex-col items-center">
      {/* Stopwatch UI */}
      <div className="relative w-40 h-40 rounded-full bg-white shadow-lg border-8 border-red-500 flex items-center justify-center">
        {/* Tick marks */}
        {tickMarks}

        {/* Central pivot */}
        <div className="absolute w-4 h-4 bg-red-500 rounded-full z-20"></div>

        {/* Rotating hand */}
        <div
          className="absolute w-1 bg-black origin-bottom z-10"
          style={{
            height: '72px',
            top: '0px',
            transform: `rotate(${360 - rotation}deg)`,
            transition: timeLeft > 0 ? 'transform 1s linear' : 'none',
          }}
        ></div>
      </div>

      {/* Time display below the clock */}
      <div className="mt-4 text-2xl font-bold">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>

      {/* Button to add time */}
      <button
        onClick={() => addTime(10)} // Example: Add 10 seconds
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
      >
        Add 10 Seconds
      </button>
    </div>
  );
}

export default Timer;
