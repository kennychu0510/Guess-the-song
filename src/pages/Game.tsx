import { Accordion, Box, Button, Stack, Text, TextInput, Title } from '@mantine/core';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { IconPlaylistAdd } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import CustomAccordionControl from '../components/AccordionControl';
import GameController from '../components/GameController';
import Scores from '../components/Scores';
import Settings from '../components/Settings';
import SongList from '../components/SongList';
import SuggestedPlaylists from '../components/SuggestedPlaylists';
import useGameContext from '../hooks/useGameContext';
import usePlaylistManager from '../hooks/usePlaylistManager';

export default function Game({ sdk, logout }: { sdk: SpotifyApi; logout: () => void }) {
  const playlistIdInputRef = useRef<HTMLInputElement>(null);
  const playerInputRef = useRef<HTMLInputElement>(null);

  const { addPlaylist, removePlaylist, playlistInputError, playlistResult, setPlaylistInputError, playlist } = usePlaylistManager(sdk);
  const [players, setPlayers] = useState<Map<string, number>>(new Map());
  const { currentSong } = useGameContext();

  function onAddPlaylist() {
    if (!playlistIdInputRef.current || !playlistIdInputRef.current.value) {
      setPlaylistInputError('Please enter a playlist ID');
      return;
    }
    addPlaylist(playlistIdInputRef.current.value);
    playlistIdInputRef.current.value = '';
  }

  function addPlayer() {
    if (!playerInputRef.current || !playerInputRef.current.value) return;
    const name = playerInputRef.current.value;
    setPlayers((list) => {
      if (list.get(name)) return list;
      const newList = new Map(list);
      newList.set(name, 0);
      return newList;
    });
    playerInputRef.current.value = '';
  }

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
    <Stack style={{ textAlign: 'start' }}>
      <Stack mb={2}>
        <Title size={'h2'}>Players</Title>
        <TextInput ref={playerInputRef} size='xl' placeholder='Name'></TextInput>
        <Button onClick={addPlayer} size='md'>
          Add
        </Button>
      </Stack>
      <Scores players={players} addScore={addScore} />
      <Stack>
        <Title size={'h2'}>Songs</Title>
        <TextInput size='xl' ref={playlistIdInputRef} placeholder='Spotify Playlist ID' error={playlistInputError} onChange={() => setPlaylistInputError('')}></TextInput>
        <Button onClick={onAddPlaylist} loading={playlistResult.isLoading} rightSection={<IconPlaylistAdd />}>
          Add Playlist
        </Button>
      </Stack>
      <Accordion>
        {Array.from(playlist.values()).map((playlist) => (
          <Accordion.Item key={playlist.id} value={playlist.name}>
            <CustomAccordionControl onClick={() => removePlaylist(playlist.id)}>
              {playlist.name} ({playlist.tracks.items.length})
            </CustomAccordionControl>
            <Accordion.Panel>
              <SongList playlist={playlist} />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <SuggestedPlaylists sdk={sdk} addPlaylist={addPlaylist} currentPlaylist={playlist} />
      <Settings logout={logout} resetGame={resetGame} resetScores={resetScores} />
      <Box bottom={0} pos={'fixed'} left={0} right={0}>
        <Stack align='center' justify='center' h={150} w={'100%'} bg={'#333'} p={20} mx={'auto'}>
          {currentSong !== null && playlist.size > 0 && (
            <Text c='white' style={{textAlign: 'center'}}>
              {currentSong?.song.name} - {currentSong?.song.artists.map((item) => item.name).join(', ')}
            </Text>
          )}
          <GameController playlist={playlist} />
        </Stack>

        
      </Box>
    </Stack>
  );
}
