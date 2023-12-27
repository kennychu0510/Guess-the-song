import { Button, Flex, Text } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useMemo } from 'react';

type Props = {
  players: Map<string, number>;
  addScore: (name: string, amount?: number) => void;
};

export default function Scores(props: Props) {
  const { players, addScore } = props;
  const sortedPlayers = useMemo(() => {
    return Array.from(players).sort((a, b) => b[1] - a[1]);
  }, [players])
  return sortedPlayers.map(([player, score]) => (
    <Flex justify={'space-between'} align={'center'}>
      <Flex style={{ flex: 1 }} mr={20} justify={'space-between'}>
        <Text>{player}</Text>
        <Text>{score}</Text>
      </Flex>
      <Flex gap={10}>
        <Button color={'red'} onClick={() => addScore(player, -1)}>
          <IconMinus></IconMinus>
        </Button>
        <Button color={'green'} onClick={() => addScore(player)}>
          <IconPlus></IconPlus>
        </Button>
      </Flex>
    </Flex>
  ));
}
