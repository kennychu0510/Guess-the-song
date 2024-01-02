import { Box, Button, InputLabel, Modal, Slider, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { GameContext } from '../context';
import useGameContext from '../hooks/useGameContext';
import { PlayIntervalValues } from '../constants';

type Props = {
  logout: () => void;
  resetGame: () => void;
  resetScores: () => void;
};

type SettingPage = 'game' | 'scores' | 'settings';

export default function Settings(props: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [page, setPage] = useState<SettingPage | null>(null);
  const { playDuration, setPlayDuration, setCurrentSong } = useGameContext();


  const queryClient = useQueryClient();

  function onLogout() {
    queryClient.removeQueries({
      queryKey: ['accessToken'],
    });
    queryClient.removeQueries({
      queryKey: ['personalPlaylist'],
    });
    localStorage.removeItem('spotify-sdk:AuthorizationCodeWithPKCEStrategy:token'); // Remove local storage key
    props.logout();
  }

  function onResetGame() {
    props.resetGame();
    setCurrentSong(null);
    close();
  }

  function onResetScores() {
    props.resetScores();
    close();
  }

  return (
    <>
      <Button style={{ width: '100%', marginBottom: 150 }} rightSection={<IconSettings />} onClick={open}>
        Settings
      </Button>
      <Modal fullScreen opened={opened} onClose={close} title='Settings' centered>
        <Stack>
          <Box mb={20}>
            <InputLabel>Song Play Duration (sec)</InputLabel>
            <Slider value={playDuration} onChange={setPlayDuration} min={2} max={20} marks={PlayIntervalValues} />
          </Box>
          <Button onClick={onResetScores} color='green'>
            Reset Scores
          </Button>
          <Button onClick={onResetGame} color='red'>
            Reset Game
          </Button>
          <Button onClick={onLogout}>Logout</Button>
        </Stack>
      </Modal>
    </>
  );
}