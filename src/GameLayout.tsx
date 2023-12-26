import { Box, Text } from '@mantine/core';
import { Track } from '@spotify/web-api-ts-sdk';
import React, { useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { GameContext } from './context';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<{
    song: Track;
    playlistId: string;
  } | null>(null);
  const audioPlayerRef = useRef<AudioPlayer>(null);

  return (
    <GameContext.Provider value={{ currentSong, setCurrentSong, player: audioPlayerRef }}>
      {children}
      <Box bottom={0} pos={'fixed'} left={0} right={0}>
        <AudioPlayer
          src={currentSong?.song.preview_url ?? ''}
          ref={audioPlayerRef}
          showDownloadProgress={true}
          autoPlay
          // onPlaying={(e) => {
          //   const randomSeekTime = Math.random() * 21;
          //   audioPlayerRef.current?.audio.current?.fastSeek(randomSeekTime * 1000);
          // }}
          header={
            <Text size={'xl'} c='black'>
              {currentSong?.song.name} - {currentSong?.song.artists.map((item) => item.name).join(',')}
            </Text>
          }
        />
      </Box>
    </GameContext.Provider>
  );
}
