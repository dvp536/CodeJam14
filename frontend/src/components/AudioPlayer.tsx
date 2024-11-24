import React, { useRef, useState } from "react";
import "./AudioPlayer.css";

interface AudioPlayerProps {
  title: string;
  audioSrc: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, audioSrc }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(1); // Default volume: 100%

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="audio-player">
      <h2>{title}</h2>
      <audio ref={audioRef}>
        <source src={audioSrc} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <div className="controls">
        <button onClick={handlePlay} className="play-button">
          Play Sound Effect
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
