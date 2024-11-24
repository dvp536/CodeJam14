import React from 'react';

interface PlayerStatusProps {
  balance: number;
  purchasedItems: string[];
}

const PlayerStatus: React.FC<PlayerStatusProps> = ({ balance, purchasedItems }) => {
  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold">Player Status</h2>
      <p>Coins: {balance}</p>
      <h3 className="text-lg mt-2">Purchased Items:</h3>
      <ul className="list-disc pl-4">
        {purchasedItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerStatus;