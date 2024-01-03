import { Accordion, AccordionControl, Button, Flex, Stack, Title } from '@mantine/core';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { IconEdit, IconMusic, IconUserPlus } from '@tabler/icons-react';
import { useState } from 'react';
import GameController from '../components/GameController';
import Scores from '../components/Scores';
import Settings from '../components/Settings';
import SongList from '../components/SongList';
import usePlaylistContext from '../hooks/usePlaylistContext';
import PlayerManagement from './PlayerManagement';
import PlaylistManagement from './PlaylistManagement';
import classes from '../Page.module.css'

type ModalTab = 'players' | 'playlist' | null;

export default function Game({ sdk, logout }: { sdk: SpotifyApi; logout: () => void }) {
  const [players, setPlayers] = useState<Map<string, number>>(new Map());
  const [modalOpened, setModalOpened] = useState<null | ModalTab>(null);

  const playlistManager = usePlaylistContext();
  if (!playlistManager) return null;

  const { playlist } = playlistManager;

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

  function closeModal() {
    setModalOpened(null);
  }

  function goToPlaylistManager() {
    setModalOpened('playlist');
  }

  return (
    <Stack style={{ textAlign: 'start' }} className={classes.Page}>
      <PlayerManagement players={players} setPlayers={setPlayers} onClose={closeModal} isOpened={modalOpened === 'players'} />
      <PlaylistManagement isOpened={modalOpened === 'playlist'} onClose={closeModal} sdk={sdk} />
      {players.size > 0 ? (
        <Stack my={20} gap={20}>
          <Flex justify={'space-between'}>
            <Title size={'h2'}>Players</Title>
            <Button>
              <IconEdit onClick={() => setModalOpened('players')} />
            </Button>
          </Flex>
          <Scores players={players} addScore={addScore} />
        </Stack>
      ) : (
        <Button onClick={() => setModalOpened('players')} rightSection={<IconUserPlus />}>
          Add Players
        </Button>
      )}
      {playlist.size > 0 ? (
        <>
          <Flex justify={'space-between'}>
            <Title size={'h2'}>Songs</Title>
            <Button>
              <IconEdit onClick={() => setModalOpened('playlist')} />
            </Button>
          </Flex>
          <Accordion>
            {Array.from(playlist.values()).map((playlist) => (
              <Accordion.Item key={playlist.id} value={playlist.name}>
                <AccordionControl>
                  {playlist.name} ({playlist.tracks.items.length})
                </AccordionControl>
                <Accordion.Panel>
                  <SongList playlist={playlist} />
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      ) : (
        <Button onClick={() => setModalOpened('playlist')} rightSection={<IconMusic />}>
          Add Playlist
        </Button>
      )}
      <Settings logout={logout} resetGame={resetGame} resetScores={resetScores} />
      <GameController playlist={playlist} goToPlaylistManager={goToPlaylistManager} />
    </Stack>
  );
}
