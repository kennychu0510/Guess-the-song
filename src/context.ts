import { Track } from '@spotify/web-api-ts-sdk';
import React from 'react';
import { createContext } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import usePlaylistManager from './hooks/usePlaylistManager';

export type CurrentSong = {
  playlistId: string;
  song: Track;
};

export const GameModes = ['Host', 'No Host', 'MC']
export type GameMode = 'Host' | 'No Host' | 'MC';


export const GameContext = createContext<{
  currentSong: CurrentSong | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<CurrentSong | null>>;
  audioPlayerRef: React.RefObject<AudioPlayer>;
  playDuration: number;
  setPlayDuration: React.Dispatch<React.SetStateAction<number>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  players: Map<string, number>
  setPlayers: React.Dispatch<React.SetStateAction<Map<string, number>>>
  addScore: (playerId: string, score?: number) => void;
  resetScores: () => void;
  resetGame: () => void
  numOfAns: number;
  setNumOfAns: React.Dispatch<React.SetStateAction<number>>;
}>({
  currentSong: null,
  setCurrentSong: () => {},
  audioPlayerRef: React.createRef<AudioPlayer>(),
  playDuration: 0,
  setPlayDuration: () => {},
  gameMode: 'Host',
  setGameMode: () => {},
  players: new Map<string, number>(),
  setPlayers: () => {},
  addScore: () => {},
  resetScores: () => {},
  resetGame: () => {},
  numOfAns: 4,
  setNumOfAns: () => {}
});

type IPlaylistContext = ReturnType<typeof usePlaylistManager> | null;

export const PlaylistContext = createContext<IPlaylistContext>(null);
