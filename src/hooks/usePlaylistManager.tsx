import { Playlist, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getPlaylistById } from '../services/getPlaylist';

export default function usePlaylistManager(sdk: SpotifyApi | null) {
  const [playlistInput, setPlaylistInput] = useState('');

  const [playlist, setPlaylist] = useState<Map<string, Playlist>>(new Map());
  const [playlistInputError, setPlaylistInputError] = useState<string>('');
  const queryClient = useQueryClient()

  const playlistResult = useQuery({
    queryKey: ['playlistItems', playlistInput],
    queryFn: () => getPlaylistById({ id: playlistInput, sdk: sdk! }),
    enabled: playlistInput !== '',
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });

  function addPlaylist(playlistId: string | undefined) {
    if (!playlistId) {
      setPlaylistInputError('Please enter a playlist ID');
      return;
    } else if (playlist.get(playlistId)) {
      setPlaylistInputError('Playlist already added');
      return;
    }
    const cachedResult = queryClient.getQueryData(['playlistItems', playlistId]);
    if (cachedResult) {
      const playlist = cachedResult as Playlist;
      setPlaylist(list => {
        const newList = new Map(list);
        newList.set(playlist.id, playlist as Playlist);
        return newList;
      })
    } else {
      setPlaylistInput(playlistId);

    }
  }


  function removePlaylist(id: string) {
    setPlaylist((list) => {
      const newList = new Map(list);
      newList.delete(id);
      return newList;
    });
  }

  useEffect(() => {
    if (!playlistResult.data) return;
    setPlaylist(list => {
      const newList = new Map(list);
      newList.set(playlistResult.data!.id, playlistResult.data!);
      return newList;
    })
  }, [playlistResult.data]);

  return {
    addPlaylist,
    removePlaylist,
    playlistInputError,
    playlistResult,
    setPlaylistInputError,
    playlist,
    setPlaylist,
  };
}
