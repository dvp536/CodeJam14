import React, { useState } from 'react';

interface ItemCardProps {
  name: string;
  price: number;
  icon: string;
  audio: string;
  onBuy: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ name, price, icon, audio, onBuy }) => {
    const [showCoins, setShowCoins] = useState(false);
    const coinImage = new URL('../assets/Images/coin1.svg', import.meta.url).href;
    const coinImage1 = new URL('../assets/Images/coin1.svg', import.meta.url).href;

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

    console.log("HHEHHEHEHE");
    console.log(coinImage);
    console.log(coinImage1);
  
    const handleBuy = () => {
      // Play the audio
      const audioElement = new Audio(audio);
      audioElement.play();

      // Show the coins
      setShowCoins(true);
      setTimeout(() => {
        setShowCoins(false); // Remove the coins after animation
        onBuy(); // Call the onBuy function
      }, 1000); // Match the animation duration
    };

    const getRandomCoin = () => (Math.random() < 0.5 ? coinImage : coinImage1);

    return (
      <div className="flex items-center bg-gray-800 text-white p-4 rounded-lg shadow-md hover:scale-105 transition transform w-full">
        <img src={icon} alt={name} className="w-12 h-12 mr-4" />
        <div className="flex-1">
          <h4 className="text-lg font-bold">{name}</h4>
          <span className="text-yellow-300 text-md">{price} Coins</span>
        </div>
        <button
          onClick={handleBuy}
          className="relative bg-blue-500 hover:bg-yellow-500 active:bg-yellow-600 text-white text-md py-2 px-4 rounded-md transition-all duration-300"
        >
          Buy
          {showCoins && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {[...Array(3)].map((_, i) => (
                    <div
                    key={i}
                    className="w-5 h-5 bg-cover bg-center absolute animate-fly"
                    style={{
                      backgroundImage: `url(${getRandomCoin()})`, // Set the coin image as the background
                      animationDelay: `${i * 0.1}s`,
                      left: `${Math.random() * 20 - 10}px`, // Random horizontal direction
                      top: `${-Math.random() * 20 + 5}px`, // Fly upward
                    }}
                    />
              ))}
            </div>
          )}
        </button>
      </div>
    );
  };
  
  export default ItemCard;