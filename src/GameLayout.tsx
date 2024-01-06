import { Track } from '@spotify/web-api-ts-sdk';
import React, { useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { GameContext, GameMode, ModeConfig } from './context';
import { DEFAULT_PLAY_DURATION } from './constants';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<{
    song: Track;
    playlistId: string;
  } | null>(null);
  const audioPlayerRef = useRef<AudioPlayer>(null);
  const [playDuration, setPlayDuration] = useState(DEFAULT_PLAY_DURATION);
  const [gameMode, setGameMode] = useState<GameMode>('Host');
  const [players, setPlayers] = useState<Map<string, number>>(new Map());
  const [modeConfig, setModeConfig] = useState<ModeConfig>({
    numOfAns: 5,
    showArtist: true,
    showSong: true,
  });

  function addScore(name: string, amount?: number) {
    setPlayers((list) => {
      const existingScore = list.get(name);
      if (existingScore === undefined) return list;
      const newList = new Map(list);
      newList.set(name, existingScore + (amount ?? 1));
      return newList;
    });
  }

  function resetScores() {
    setPlayers((players) => {
      const newPlayers = new Map(players);
      newPlayers.forEach((_, key) => {
        newPlayers.set(key, 0);
      });
      return newPlayers;
    });
  }

  function resetGame() {
    setPlayers(new Map());
  }

  return (
    <GameContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        audioPlayerRef: audioPlayerRef,
        playDuration,
        setPlayDuration,
        gameMode,
        setGameMode,
        players,
        setPlayers,
        addScore,
        resetGame,
        resetScores,
        modeConfig,
        setModeConfig
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
