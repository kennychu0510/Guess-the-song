import { Accordion, Button, Modal, Stack, TextInput, Title } from '@mantine/core';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { IconPlaylistAdd } from '@tabler/icons-react';
import { useRef } from 'react';
import CustomAccordionControl from '../components/AccordionControl';
import SongList from '../components/SongList';
import SuggestedPlaylists from '../components/SuggestedPlaylists';
import usePlaylistContext from '../hooks/usePlaylistContext';

export default function PlaylistManagement({ sdk, isOpened, onClose }: { sdk: SpotifyApi; isOpened: boolean; onClose: () => void }) {
  const playlistIdInputRef = useRef<HTMLInputElement>(null);
  const playlistManager = usePlaylistContext();

  if (!playlistManager) return null;
  const { addPlaylist, playlistInputError, playlistResult, setPlaylistInputError, playlist, removePlaylist } = playlistManager;

  function onAddPlaylist() {
    if (!playlistIdInputRef.current || !playlistIdInputRef.current.value) {
      setPlaylistInputError('Please enter a playlist ID');
      return;
    }

    addPlaylist(playlistIdInputRef.current.value);
    playlistIdInputRef.current.value = '';
  }

  return (
    <Modal.Root fullScreen opened={isOpened} onClose={onClose} centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header maw={500} mx={'auto'}>
          <Modal.Title>
            <Title>Manage Playlist</Title>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body maw={500} mx={'auto'}>
          <Stack>
          {playlist.size > 0 ? <Title size={'h2'}>Current Playlist</Title> : <Title size={'h2'}>Your playlist is empty</Title>}
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

            <Title mt={40} size={'h2'}>Add Songs</Title>
            <TextInput size='xl' ref={playlistIdInputRef} placeholder='Spotify Playlist ID' error={playlistInputError} onChange={() => setPlaylistInputError('')}></TextInput>
            <Button onClick={onAddPlaylist} loading={playlistResult.isLoading} rightSection={<IconPlaylistAdd />}>
              Add by playlist ID
            </Button>
            <SuggestedPlaylists sdk={sdk} addPlaylist={addPlaylist} currentPlaylist={playlist} />
            
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
