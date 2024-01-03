import { Button, Stack, Title } from '@mantine/core';
import { IconBrandSpotify } from '@tabler/icons-react';
import './App.css';
import GameLayout from './GameLayout';
import useSpotifyManager from './hooks/useSpotifyManager';
import Game from './pages/Game';
import usePlaylistManager from './hooks/usePlaylistManager';
import { PlaylistContext } from './context';

function App() {
  const { getToken, sdk, logout } = useSpotifyManager();
  const playlistManager = usePlaylistManager(sdk);

  return (
    <GameLayout>
      <PlaylistContext.Provider value={playlistManager}>
        <Stack mb={20}>
          <Title size='h1' fw={'bold'} style={{ textAlign: 'center' }}>
            Guess the Song
          </Title>

          {sdk !== null ? (
            <Game sdk={sdk} logout={logout} />
          ) : (
            <Stack justify='center' style={{ height: '70dvh' }}>
              <Button size='md' onClick={getToken} color='black' rightSection={<IconBrandSpotify color='#1DB954' />}>
                Connect Spotify
              </Button>
            </Stack>
          )}
        </Stack>
      </PlaylistContext.Provider>
    </GameLayout>
  );
}

export default App;
