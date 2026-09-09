import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next logic could go here
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playTrack = (track, trackList = []) => {
    if (currentTrack?._id === track._id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (currentTrack?._id === track._id && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.src = `${API_BASE_URL}/audio/stream/${track._id}`;
      audioRef.current.play();
      setCurrentTrack(track);
      setIsPlaying(true);
      if (trackList.length > 0) setPlaylist(trackList);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef.current.src) {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const stopTrack = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTrack(null);
    setProgress(0);
  };

  const seek = (percent) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = (percent / 100) * audio.duration;
      setProgress(percent);
    }
  };

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, progress, playTrack, togglePlay, stopTrack, seek, playlist }}>
      {children}
    </AudioContext.Provider>
  );
};
