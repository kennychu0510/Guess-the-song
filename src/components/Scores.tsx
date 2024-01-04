import { Box, Button, Flex, Modal, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useMemo } from 'react';
import { RankingDisplay } from './RankingDisplay';

type Props = {
  players: Map<string, number>;
  addScore: (name: string, amount?: number) => void;
};

export default function Scores(props: Props) {
  const { players, addScore } = props;
  const [opened, { open, close }] = useDisclosure(false);

  const sortedPlayers = useMemo(() => {
    return Array.from(players).sort((a, b) => b[1] - a[1]);
  }, [players]);

  function onAddScore(name: string) {
    addScore(name, 1);
    close();
  }

  return (
    <>
      <Stack>
        {sortedPlayers.map(([player, score]) => (
          <Flex justify={'space-between'} align={'center'} key={player}>
            <Flex style={{ flex: 1 }} mr={20} justify={'space-between'}>
              <Flex align={'center'}>
                {score !== 0 && (
                  <Box w={30}>
                    {' '}
                    <RankingDisplay index={getRank(players, player)} />
                  </Box>
                )}
                <Text ml={5}>{player}</Text>
              </Flex>
              <Text>{score}</Text>
            </Flex>
          </Flex>
        ))}
        <Button color='green' onClick={open} rightSection={<IconPlus />}>
          Add Score
        </Button>
      </Stack>
      <Modal.Root fullScreen opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header maw={500} mx={'auto'}>
            <Modal.Title>
              <Title>Scores</Title>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body maw={500} mx={'auto'}>
            <Stack>
              {sortedPlayers.map(([player, score]) => (
                <Flex justify={'space-between'} align={'center'} key={player}>
                  <Flex style={{ flex: 1 }} mr={20} justify={'space-between'}>
                    <Flex align={'center'}>
                      {score !== 0 && (
                        <Box w={40}>
                          {' '}
                          <RankingDisplay index={getRank(players, player)} />
                        </Box>
                      )}
                      <Text ml={5}>{player}</Text>
                    </Flex>
                    <Text>{score}</Text>
                  </Flex>
                  <Button color='green' onClick={() => onAddScore(player)}>
                    <IconPlus />
                  </Button>
                </Flex>
              ))}
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

function getRank(players: Map<string, number>, name: string) {
  const sorted = Array.from(players)
    .sort((a, b) => b[1] - a[1])
    .map((item) => item[1]);
  const allScores = Array.from(new Set(sorted));
  return allScores.indexOf(players.get(name) as number);
}
