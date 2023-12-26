import { Playlist, Track } from '@spotify/web-api-ts-sdk';
import React, { useEffect, useState } from 'react'
import { songIsTrack } from '../helper';
import { useQuery } from '@tanstack/react-query';
import { getPlaylistById } from '../services/getPlaylist';

export default function usePlaylistManager() {
  const [playlistInput, setPlaylistInput] = useState('');

  const [playlist, setPlaylist] = useState<Map<string, Playlist>>(new Map());
  const [playlistInputError, setPlaylistInputError] = useState<string>('');

  const playlistResult = useQuery({
    queryKey: ['playlistItems', playlistInput],
    queryFn: () => getPlaylistById({ id: playlistInput }),
    enabled: playlistInput !== '',
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });


  function addPlaylist(playlistId: string | undefined) {
    if (!playlistId) {
      setPlaylistInputError('Please enter a playlist ID');
      return;
    }
    setPlaylistInput(playlistId);
    updateGamePlaylist();
  }

  function updateGamePlaylist() {
    setPlaylist((list) => {
      if (!playlistResult.data) return list;
      if (playlist.get(playlistResult.data.id)) return list;
      const newList = new Map(list);
      const newPlaylist = playlistResult.data!;
      newPlaylist.tracks.items = newPlaylist.tracks.items
        .filter((item) => songIsTrack(item.track))
        .filter((item) => {
          const track = item.track as Track;
          return track.preview_url !== null;
        });
      newList.set(playlistResult.data!.id, playlistResult.data!);
      return newList;
    });
  }

  function removePlaylist(id: string) {
    setPlaylist((list) => {
      const newList = new Map(list);
      newList.delete(id);
      return newList;
    });
  }


  useEffect(() => {
    updateGamePlaylist();
  }, [playlistResult.data]);



  return {
    addPlaylist,
    removePlaylist,
    playlistInputError,
    playlistResult,
    setPlaylistInputError,
    playlist
  }
}
