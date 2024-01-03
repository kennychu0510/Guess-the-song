import { Box, Button, InputLabel, Modal, Slider, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { BOTTOM_TAB_HEIGHT, PlayIntervalValues } from '../constants';
import useGameContext from '../hooks/useGameContext';

type Props = {
  logout: () => void;
  resetGame: () => void;
  resetScores: () => void;
};

export default function Settings(props: Props) {
  const [opened, { open, close }] = useDisclosure(false);
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
      <Button style={{ width: '100%', marginTop: 'auto', marginBottom: BOTTOM_TAB_HEIGHT }} rightSection={<IconSettings />} onClick={open}>
        Settings
      </Button>
      <Modal.Root fullScreen opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Title>Settings</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Stack h={'80dvh'}>
              <Box mb={20} style={{ flex: 1 }}>
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
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
