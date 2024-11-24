import React, { useState } from 'react';
import ItemCard from './ItemCard';

const joker = new URL('../assets/Images/items/cheating-joker.svg', import.meta.url).href;
const distraction = new URL('../assets/Images/items/distraction-bomb.svg', import.meta.url).href;
const double_nothing = new URL('../assets/Images/items/double-nothing.svg', import.meta.url).href;
const freeze_frenzy = new URL('../assets/Images/items/freeze-frenzy.svg', import.meta.url).href;
const glasses = new URL('../assets/Images/items/glasses.svg', import.meta.url).href;
const hourglass = new URL('../assets/Images/items/loop-hourglass.svg', import.meta.url).href;
const lucky_charm = new URL('../assets/Images/items/lucky-charm.svg', import.meta.url).href;
const magnet = new URL('../assets/Images/items/magnet.svg', import.meta.url).href
const multipotion = new URL('../assets/Images/items/multi-potion.svg', import.meta.url).href
const poisonpotion = new URL('../assets/Images/items/poison-potion.svg', import.meta.url).href;
const shield= new URL('../assets/Images/items/shield.svg', import.meta.url).href;

const mockItems = [
  { name: "Double or Nothing Coin", price: 50, icon: joker},
  { name: "Time Extender", price: 30, icon: hourglass  },
  { name: "Freeze Frenzy", price: 40, icon: freeze_frenzy },
  { name: "Lucky Charm", price: 25, icon:  lucky_charm},
  { name: "Confusion Bomb", price: 60, icon: distraction },
  { name: "Insight Glasses", price: 45, icon: glasses },
  { name: "Cheating Joker", price: 45, icon: joker},
  { name: "Hourglass Loop", price: 45, icon: hourglass },
  { name: "Sneaky Magnet", price: 45, icon: magnet},
  { name: "Light Shield", price: 45, icon: shield },
  { name: "Distraction Bomb", price: 45, icon: distraction },

];

const ItemStore: React.FC = () => {
  const [playerBalance, setPlayerBalance] = useState(200);

  

  const handleBuy = (price: number) => {
    if (playerBalance >= price) {
        setPlayerBalance(playerBalance - price);
        console.log("Item purchased!");
    } else {
        console.log("Not enough coins!");
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-white text-lg font-bold mb-2">Item Store</h2>
      <div className="text-yellow-300 text-sm mb-4">Coins: {playerBalance}</div>
      <div
            className="space-y-4 max-h-80 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pr-4 pl-2"
            >
            {mockItems.map((item) => (
                <ItemCard
                key={item.name}
                name={item.name}
                price={item.price}
                icon={item.icon}
                onBuy={() => handleBuy(item.price)}
                />
            ))}
        </div>
    </div>
  );
};

export default ItemStore;