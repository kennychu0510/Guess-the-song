import { Accordion, Button, Flex, Stack, TextInput, Title } from '@mantine/core';
import { IconBrandSpotify, IconPlaylistAdd } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import './App.css';
import GameLayout from './GameLayout';
import CustomAccordionControl from './components/AccordionControl';
import GameController from './components/GameController';
import Scores from './components/Scores';
import Settings from './components/Settings';
import SongList from './components/SongList';
import usePlaylistManager from './hooks/usePlaylistManager';
import useSpotifyManager from './hooks/useSpotifyManager';

function App() {
  const playlistIdInputRef = useRef<HTMLInputElement>(null);
  const playerInputRef = useRef<HTMLInputElement>(null);
  const { getToken, sdk, logout } = useSpotifyManager();

  const { addPlaylist, removePlaylist, playlistInputError, playlistResult, setPlaylistInputError, playlist } = usePlaylistManager(sdk);
  const [players, setPlayers] = useState<Map<string, number>>(new Map());

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
    setPlayers(new Map());
  }

  function resetGame() {
    setPlayers((players) => {
      const newPlayers = new Map(players);
      newPlayers.forEach((_, key) => {
        newPlayers.set(key, 0);
      });
      return newPlayers;
    });
  }

  return (
    <GameLayout>
      <Stack mb={20}>
        <Title size='h1' fw={'bold'} style={{ textAlign: 'center' }}>
          Guess the Song
        </Title>

        {sdk !== null ? (
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
              <TextInput size='xl' ref={playlistIdInputRef} placeholder='Spotify ID' error={playlistInputError} onChange={() => setPlaylistInputError('')}></TextInput>
              <Flex justify={'space-between'}>
                <Button onClick={onAddPlaylist} loading={playlistResult.isLoading} rightSection={<IconPlaylistAdd />}>
                  Add Playlist
                </Button>
                <GameController playlist={playlist} />
              </Flex>
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
            <Settings logout={logout} resetGame={resetGame} resetScores={resetScores} />
          </Stack>
        ) : (
          <Stack justify='center' style={{ height: '70dvh' }}>
            <Button onClick={getToken} rightSection={<IconBrandSpotify />}>
              Connect Spotify
            </Button>
          </Stack>
        )}
      </Stack>
    </GameLayout>
  );
}

export default App;
