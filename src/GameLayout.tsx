import { Track } from '@spotify/web-api-ts-sdk';
import React, { useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { GameContext } from './context';
import { DEFAULT_PLAY_DURATION } from './constants';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<{
    song: Track;
    playlistId: string;
  } | null>(null);
  const audioPlayerRef = useRef<AudioPlayer>(null);
  const [playDuration, setPlayDuration] = useState(DEFAULT_PLAY_DURATION) 

  return <GameContext.Provider value={{ currentSong, setCurrentSong, audioPlayerRef: audioPlayerRef, playDuration, setPlayDuration }}>{children}</GameContext.Provider>;
}
