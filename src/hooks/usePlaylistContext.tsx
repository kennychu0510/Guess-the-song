import { useContext } from 'react';
import { PlaylistContext } from '../context';

export default function usePlaylistContext() {
  const playlistContext = useContext(PlaylistContext);
  return playlistContext;
}
