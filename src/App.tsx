import { Accordion, Button, Input, Stack, Title } from '@mantine/core';
import { IconPlaylistAdd, IconArrowsShuffle } from '@tabler/icons-react';
import { useContext, useRef } from 'react';
import './App.css';
import GameLayout from './GameLayout';
import CustomAccordionControl from './components/AccordionControl';
import SongList from './components/SongList';
import usePlaylistManager from './hooks/usePlaylistManager';
import GameController from './components/GameController';

function App() {
  const playlistIdInputRef = useRef<HTMLInputElement>(null);
  const { addPlaylist, removePlaylist, playlistInputError, playlistResult, setPlaylistInputError, playlist } = usePlaylistManager();
  return (
    <GameLayout>
      <Stack
        style={{
          paddingBottom: 150,
        }}
      >
        <Title size='h1' fw={'bold'} style={{ textAlign: 'center' }}>
          Guess the Song
        </Title>

        <Input size='xl' ref={playlistIdInputRef} placeholder='Spotify ID' error={playlistInputError} onChange={() => setPlaylistInputError('')}></Input>
        <Button onClick={() => addPlaylist(playlistIdInputRef.current?.value)} loading={playlistResult.isLoading} rightSection={<IconPlaylistAdd />}>
          Add Playlist
        </Button>
        <GameController playlist={playlist} />
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
      </Stack>
    </GameLayout>
  );
}

export default App;
