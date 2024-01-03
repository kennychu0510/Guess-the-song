import { Button, Flex, Text } from '@mantine/core';
import { Playlist } from '@spotify/web-api-ts-sdk';
import { IconArrowsShuffle, IconMusic, IconMusicPause, IconPlayerPlay } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { MAX_PLAY_DURATION } from '../constants';
import { GameContext } from '../context';
import { songIsTrack } from '../helper';

type TrackSequence = {
  playlistId: string;
  trackIndex: number;
};

export default function GameController({ playlist, goToPlaylistManager }: { playlist: Map<string, Playlist>; goToPlaylistManager: () => void }) {
  const { setCurrentSong, audioPlayerRef, currentSong, playDuration } = useContext(GameContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomSequence, setRandomSequence] = useState<TrackSequence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  function pauseSong() {
    audioPlayerRef.current?.audio.current?.pause();
  }

  function playSong() {
    audioPlayerRef.current?.audio.current?.play();
  }

  function playRandomSong() {
    const currentSong = randomSequence[currentIndex];
    const song = playlist.get(currentSong.playlistId)?.tracks.items[currentSong.trackIndex].track;
    if (song && songIsTrack(song)) {
      setCurrentSong({
        song,
        playlistId: randomSequence[currentIndex].playlistId,
      });
      setCurrentIndex((index) => {
        if (index >= randomSequence.length) return 0;
        return index + 1;
      });
      const randomStart = getRandomStartTime(MAX_PLAY_DURATION, playDuration);
      audioPlayerRef.current?.setJumpTime(randomStart);
    }
  }

  useEffect(() => {
    if (playlist.size === 0) return;
    const sequence: TrackSequence[] = [];
    for (const p of playlist.values()) {
      const playlistId = p.id;
      p.tracks.items.forEach((_, i) => {
        sequence.push({ playlistId, trackIndex: i });
      });
    }
    const randomSequence = sequence.sort(() => Math.random() - 0.5);
    setRandomSequence(randomSequence);
    setCurrentIndex(0);
  }, [playlist]);

  function onPlay() {
    const randomStart = getRandomStartTime(MAX_PLAY_DURATION, playDuration);
    audioPlayerRef.current?.setJumpTime(randomStart);
    setIsPlaying(true);
    const time = new Date();
    time.setSeconds(time.getSeconds() + playDuration);
    setStartTime(Date.now());
  }

  function onPause() {
    setIsPlaying(false);
  }

  return (
    <Flex gap={20}>
      {playlist.size === 0 ? (
        <Button rightSection={<IconMusic/>} onClick={goToPlaylistManager}>
          Add a Playlist
        </Button>
      ) : (
        <>
          {isPlaying ? (
            <Button onClick={pauseSong} color='red'>
              <IconMusicPause />
            </Button>
          ) : (
            currentSong !== null && (
              <Button onClick={playSong} color='green'>
                <IconPlayerPlay />
              </Button>
            )
          )}
          <Button rightSection={<IconArrowsShuffle />} onClick={playRandomSong}>
            Play Random
          </Button>
          <AudioPlayer
            src={currentSong?.song.preview_url ?? ''}
            ref={audioPlayerRef}
            showDownloadProgress={true}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={() => setIsPlaying(false)}
            onPlayError={() => setIsPlaying(false)}
            onLoadStart={() => {
              pauseSong();
              setTimeout(() => {
                playSong();
              }, 500);
            }}
            onListen={() => {
              const currentTime = Date.now();
              if (currentTime - startTime > playDuration * 1000) {
                pauseSong();
              }
            }}
            header={
              <Text size={'xl'} c='black'>
                {currentSong?.song.name} - {currentSong?.song.artists.map((item) => item.name).join(', ')}
              </Text>
            }
            style={{ opacity: 0, position: 'absolute', zIndex: -1, left: 0 }}
          />
        </>
      )}
    </Flex>
  );
}

function getRandomStartTime(maxDuration: number, playDuration: number) {
  return Math.floor(Math.random() * (maxDuration - playDuration)) * 1000;
}
