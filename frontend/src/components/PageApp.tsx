import React, { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";

const PageApp: React.FC = () => {
  const [audioFiles] = useState([
    { title: "Random Song 1", src: "/Music/SongMenu.mp3" },
    { title: "Random Song 2", src: "/Music/SongQuestion1.mp3" },
    { title: "Random Song 3", src: "/Music/SongQuestion2.mp3" },
    { title: "Random Song 4", src: "/Music/SongQuestion3.mp3" },
    { title: "Random Song 5", src: "/Music/SongQuestion4.mp3" },
    { title: "Random Song 6", src: "/Music/SongQuestion5.mp3" },
  ]);
  const [sound, setSound] = useState([
    { title: "Sound Effect 1", src: "/SoundEffect/SoundIntro.mp3" },
    { title: "Sound Effect 2", src: "/SoundEffect/SoundCorrect.mp3" },
    { title: "Sound Effect 3", src: "/SoundEffect/SoundPop.mp3" },
    { title: "Sound Effect 4", src: "/SoundEffect/SoundTransition.mp3" },
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
      {sound.map((audio, index) => (
        <AudioPlayer key={index} title={audio.title} audioSrc={audio.src} />
      ))}
      {/* {!isUserInteracted && (
        <p>Click anywhere to start playing a random song.</p>
      )} */}
    </div>
  );
};

export default PageApp;
