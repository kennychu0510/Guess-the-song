import { Track } from '@spotify/web-api-ts-sdk';
import React from 'react';
import { createContext } from 'react';
import AudioPlayer from 'react-h5-audio-player';

type CurrentSong = {
  playlistId: string;
  song: Track;
};

export const GameContext = createContext<{
  currentSong: CurrentSong | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<CurrentSong | null>>;
  audioPlayerRef: React.RefObject<AudioPlayer>;
}>({
  currentSong: null,
  setCurrentSong: () => {},
  audioPlayerRef: React.createRef<AudioPlayer>(),
});
