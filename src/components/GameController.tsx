import { Button } from '@mantine/core';
import { Playlist } from '@spotify/web-api-ts-sdk';
import { IconArrowsShuffle } from '@tabler/icons-react';
import { useContext } from 'react';
import { GameContext } from '../context';
import { songIsTrack } from '../helper';

export default function GameController({ playlist }: { playlist: Map<string, Playlist> }) {
  const { setCurrentSong, currentSong } = useContext(GameContext);

  function playRandomSong() {
    const allSongs = Array.from(playlist.values());
    const randomPlaylist = allSongs[Math.floor(Math.random() * allSongs.length)];
    const randomSong = randomPlaylist.tracks.items[Math.floor(Math.random() * randomPlaylist.tracks.items.length)];
    const track = randomSong.track;
    if (songIsTrack(track)) {
      console.log(randomSong.track.name);
      setCurrentSong({
        song: track,
        playlistId: randomPlaylist.id,
      });
    }
  }
  return (
    <Button rightSection={<IconArrowsShuffle />} onClick={playRandomSong}>
      Play Random
    </Button>
  );
}
