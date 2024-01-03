import { Button, Flex, Stack, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useMemo } from 'react';

type Props = {
  players: Map<string, number>;
  addScore: (name: string, amount?: number) => void;
};

export default function Scores(props: Props) {
  const { players, addScore } = props;
  const sortedPlayers = useMemo(() => {
    return Array.from(players).sort((a, b) => b[1] - a[1]);
  }, [players]);

  return (
    <Stack>
      {sortedPlayers.map(([player, score], index) => (
        <Flex justify={'space-between'} align={'center'} key={player}>
          <Flex style={{ flex: 1 }} mr={20} justify={'space-between'}>
            <Flex>
              <Text w={15}>{index + 1}.</Text>
              <Text ml={5}>{player}</Text>
            </Flex>
            <Text>{score}</Text>
          </Flex>
          <Button color='green' onClick={() => addScore(player, 1)}>
            <IconPlus />
          </Button>
        </Flex>
      ))}
    </Stack>
  );
}
