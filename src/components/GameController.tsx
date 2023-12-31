import { Button, Flex, Text } from '@mantine/core';
import { Playlist } from '@spotify/web-api-ts-sdk';
import { IconArrowsShuffle, IconMusicPause, IconPlayerPlay } from '@tabler/icons-react';
import { useContext, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { GameContext } from '../context';
import { songIsTrack } from '../helper';

export default function GameController({ playlist }: { playlist: Map<string, Playlist> }) {
  const { setCurrentSong, audioPlayerRef, currentSong } = useContext(GameContext);
  const [isPlaying, setIsPlaying] = useState(false);

  function pauseSong() {
    audioPlayerRef.current?.audio.current?.pause();
  }

  function playSong() {
    audioPlayerRef.current?.audio.current?.play();
  }

  function playRandomSong() {
    const allSongs = Array.from(playlist.values());
    const randomPlaylist = allSongs[Math.floor(Math.random() * allSongs.length)];
    const randomSong = randomPlaylist.tracks.items[Math.floor(Math.random() * randomPlaylist.tracks.items.length)];
    const track = randomSong.track;
    if (songIsTrack(track)) {
      setCurrentSong({
        song: track,
        playlistId: randomPlaylist.id,
      });
    }
  }


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
            <Button onClick={playSong} color='green'>
              <IconPlayerPlay />
            </Button>
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
                {currentSong?.song.name} - {currentSong?.song.artists.map((item) => item.name).join(',')}
              </Text>
            }
            style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
          />
        </>
      )}
    </Flex>
  );
}
