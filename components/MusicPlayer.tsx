import React, { useState, useEffect, useRef } from 'react';
import { Music, VolumeX } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Upbeat, looping, racing/kids style background music
  // Using a royalty-free track suitable for kids games
  const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/09/26/audio_021260a2d0.mp3";

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Lower volume so it's background

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // User interaction allows play
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={togglePlay}
      className="fixed top-4 right-4 z-50 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white border-2 border-white/30 transition-all shadow-lg active:scale-95"
      title={isPlaying ? "关闭音乐" : "播放音乐"}
    >
      {isPlaying ? (
        <Music className="w-6 h-6 animate-pulse" />
      ) : (
        <VolumeX className="w-6 h-6" />
      )}
    </button>
  );
};
