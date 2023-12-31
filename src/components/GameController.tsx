import { Button, Flex, Text } from '@mantine/core';
import { Playlist } from '@spotify/web-api-ts-sdk';
import { IconArrowsShuffle, IconMusicPause, IconPlayerPlay } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { GameContext } from '../context';
import { songIsTrack } from '../helper';

type TrackSequence = {
  playlistId: string;
  trackIndex: number;
};

export default function GameController({ playlist }: { playlist: Map<string, Playlist> }) {
  const { setCurrentSong, audioPlayerRef, currentSong } = useContext(GameContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomSequence, setRandomSequence] = useState<TrackSequence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    }
  }

  useEffect(() => {
    if (playlist.size === 0) return;
    const sequence: TrackSequence[] = [];
    for (let p of playlist.values()) {
      const playlistId = p.id;
      p.tracks.items.forEach((_, i) => {
        sequence.push({ playlistId, trackIndex: i });
      });
    }
    const randomSequence = sequence.sort(() => Math.random() - 0.5);
    setRandomSequence(randomSequence);
    setCurrentIndex(0);
  }, [playlist]);

  return (
    <Flex gap={20}>
      {playlist.size === 0 ? (
        <Text size='xl'>Add a playlist</Text>
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
            autoPlay
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onPlayError={() => setIsPlaying(false)}
            header={
              <Text size={'xl'} c='black'>
                {currentSong?.song.name} - {currentSong?.song.artists.map((item) => item.name).join(', ')}
              </Text>
            }
            style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
          />
        </>
      )}
    </Flex>
  );
}
