import { Box, Button, Modal, SegmentedControl, Slider, Stack, Switch, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import classes from '../Page.module.css';
import { BOTTOM_TAB_HEIGHT, NumOfAnsMarks, PlayIntervalValues } from '../constants';
import { GameMode, GameModes } from '../context';
import useGameContext from '../hooks/useGameContext';
import InstallPWAButton from './InstallPWAButton';

type Props = {
  logout: () => void;
  resetGame: () => void;
  resetScores: () => void;
};

export default function Settings(props: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const { playDuration, setPlayDuration, setCurrentSong, gameMode, setGameMode, modeConfig, setModeConfig } = useGameContext();

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

  function onChangeGameMode(value: string) {
    setGameMode(value as GameMode);
  }

  function onChangeNumOfAns(value: number) {
    setModeConfig({ ...modeConfig, numOfAns: value });
  }

  return (
    <>
      <Button style={{ width: '100%', marginTop: 'auto', marginBottom: BOTTOM_TAB_HEIGHT }} rightSection={<IconSettings />} onClick={open}>
        Settings
      </Button>
      <Modal.Root fullScreen opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header maw={500} mx={'auto'}>
            <Modal.Title>
              <Title>Settings</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body maw={500} mx={'auto'}>
            <Stack className={classes.Settings}>
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
                  <SegmentedControl fullWidth data={GameModes} value={gameMode} onChange={onChangeGameMode} />
                </Box>
                {gameMode === 'MC' && (
                  <>
                    <Box>
                      <Text size='md' mb={10} fw={'bold'}>
                        Number of Answers
                      </Text>
                      <Slider value={modeConfig.numOfAns} onChange={onChangeNumOfAns} min={4} max={10} marks={NumOfAnsMarks} />
                    </Box>
                    <Box>
                      <Text size='md' mb={10} fw={'bold'}>
                        Show Artist
                      </Text>
                      <Switch size="xl" onLabel='Yes' offLabel='No' checked={modeConfig.showArtist} onChange={(event) => setModeConfig({...modeConfig, showArtist: event.currentTarget.checked})} />
                    </Box>
                  </>
                )}
              </Stack>
              <Button onClick={onResetScores} color='green'>
                Reset Scores
              </Button>
              <Button onClick={onResetGame} color='red'>
                Reset Game
              </Button>
              <InstallPWAButton />
              <Button onClick={onLogout}>Logout</Button>
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
