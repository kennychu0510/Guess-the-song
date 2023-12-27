import { Button, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { GameContext } from '../context';

type Props = {
  logout: () => void;
  resetGame: () => void;
  resetScores: () => void;
};

export default function Settings(props: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const { setCurrentSong } = useContext(GameContext);

  const queryClient = useQueryClient();

  function onLogout() {
    queryClient.removeQueries({
      queryKey: ['accessToken'],
    });
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
      <Modal opened={opened} onClose={close} title='Settings' centered>
        <Stack>
          <Button onClick={onResetScores} color='purple'>
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
