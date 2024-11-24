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

// sound effects
const joker_sound = new URL('../assets/SoundEffects/SoundCheatingJoker.mp3', import.meta.url).href;
const distraction_sound = new URL('../assets/SoundEffects/SoundDistractionBomb.mp3', import.meta.url).href;
const double_nothing_sound = new URL('../assets/SoundEffects/SoundDoubleOrNothing.mp3', import.meta.url).href;
const freeze_frenzy_sound = new URL('../assets/SoundEffects/SoundFreezeFrenzy.mp3', import.meta.url).href;
const glasses_sound = new URL('../assets/SoundEffects/SoundInsightGlasses.mp3', import.meta.url).href;
const hourglass_sound = new URL('../assets/SoundEffects/SoundTimeLoop.mp3', import.meta.url).href;
const lucky_charm_sound = new URL('../assets/SoundEffects/SoundLuckyCharm.mp3', import.meta.url).href;
const magnet_sound = new URL('../assets/SoundEffects/SoundMoneyMagnet.mp3', import.meta.url).href;
const multipotion_sound = new URL('../assets/SoundEffects/SoundMultiplierPotion.mp3', import.meta.url).href;
const poisonpotion_sound = new URL('../assets/SoundEffects/SoundPoisonPotion.mp3', import.meta.url).href;
const shield_sound = new URL('../assets/SoundEffects/SoundAnswerShield.mp3', import.meta.url).href;


const mockItems = [
  { name: "Time Extender", price: 30, icon: hourglass, audio: hourglass_sound },
  { name: "Double or Nothing", price: 50, icon: double_nothing, audio: double_nothing_sound },
  { name: "Distraction Bomb", price: 60, icon: distraction, audio: distraction_sound },
  { name: "Insight Glasses", price: 45, icon: glasses, audio: glasses_sound },
  { name: "Cheating Joker", price: 45, icon: joker, audio: joker_sound },
  { name: "Multiplying Potion", price: 45, icon: multipotion, audio: multipotion_sound },
  { name: "Light Shield", price: 45, icon: shield, audio: shield_sound },
  { name: "Poison Potion", price: 45, icon: poisonpotion, audio: poisonpotion_sound },
  { name: "Lucky Charm", price: 25, icon:  lucky_charm, audio: lucky_charm_sound },
  { name: "Freeze Frenzy", price: 40, icon: freeze_frenzy, audio: freeze_frenzy_sound },
  { name: "Sneaky Magnet", price: 45, icon: magnet, audio: magnet_sound },
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
                audio={item.audio}
                onBuy={() => handleBuy(item.price)}
                />
            ))}
        </div>
    </div>
  );
};

export default ItemStore;