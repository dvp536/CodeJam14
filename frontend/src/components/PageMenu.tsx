import React, { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";

const PageApp: React.FC = () => {
  const [audioFiles] = useState([
    { title: "Random Song 1", src: "/Music/SongMenu.mp3" },
  ]);

  const [isUserInteracted, setIsUserInteracted] = useState(false);

  const handleUserInteraction = () => {
    setIsUserInteracted(true);
  };

  useEffect(() => {
    if (isUserInteracted) {
      // Select a random song when the user interacts
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      const randomSong = audioFiles[randomIndex];
      const audio = new Audio(randomSong.src);

      // Attempt to play the audio
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  }, [isUserInteracted, audioFiles]);

  return (
    <div
      style={{ textAlign: "center", marginTop: "50px" }}
      onClick={handleUserInteraction}
    >
      <h1>Audio Player List</h1>
      {audioFiles.map((audio, index) => (
        <AudioPlayer key={index} title={audio.title} audioSrc={audio.src} />
      ))}
      {/* {!isUserInteracted && (
        <p>Click anywhere to start playing a random song.</p>
      )} */}
    </div>
  );
};

export default PageApp;
