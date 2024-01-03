import { Box, Button, Flex, Modal, Slider, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { BOTTOM_TAB_HEIGHT, PlayIntervalValues } from '../constants';
import useGameContext from '../hooks/useGameContext';
import classes from '../Page.module.css'

type Props = {
  logout: () => void;
  resetGame: () => void;
  resetScores: () => void;
};

export default function Settings(props: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const { playDuration, setPlayDuration, setCurrentSong, gameMode, setGameMode } = useGameContext();

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
            <Stack className={classes.Page}>
              <Stack mb={20} style={{ flex: 1 }} gap={30}>
                <Box>
                  <Text size='md' fw={'bold'} mb={10}>
                    Song Play Duration (sec)
                  </Text>
                  <Slider value={playDuration} onChange={setPlayDuration} min={2} max={20} marks={PlayIntervalValues} />
                </Box>
                <Box>
                  <Text size='md' mb={10} fw={'bold'}>
                    Game mode
                  </Text>
                  <Flex justify={'space-around'} gap={50}>
                    <Button onClick={() => setGameMode('host')} variant={gameMode === 'host' ? 'filled' : 'outline'} w={'100%'}>
                      With host
                    </Button>
                    <Button onClick={() => setGameMode('guess')} variant={gameMode === 'guess' ? 'filled' : 'outline'} w={'100%'}>
                      Without host
                    </Button>
                  </Flex>
                </Box>
              </Stack>
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
