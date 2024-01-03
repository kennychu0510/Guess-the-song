import { Track } from '@spotify/web-api-ts-sdk';
import React from 'react';
import { createContext } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import usePlaylistManager from './hooks/usePlaylistManager';

type CurrentSong = {
  playlistId: string;
  song: Track;
};

export type GameMode = 'host' | 'guess'

export const GameContext = createContext<{
  currentSong: CurrentSong | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<CurrentSong | null>>;
  audioPlayerRef: React.RefObject<AudioPlayer>;
  playDuration: number;
  setPlayDuration: React.Dispatch<React.SetStateAction<number>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
}>({
  currentSong: null,
  setCurrentSong: () => {},
  audioPlayerRef: React.createRef<AudioPlayer>(),
  playDuration: 0,
  setPlayDuration: () => {},
  gameMode: 'host',
  setGameMode: () => {},
});

type IPlaylistContext = ReturnType<typeof usePlaylistManager> | null;

export const PlaylistContext = createContext<IPlaylistContext>(null);
