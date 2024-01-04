import { Button, Flex, Modal, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import React, { useRef } from 'react';

export default function PlayerManagement({
  players,
  setPlayers,
  onClose,
  isOpened,
}: {
  players: Map<string, number>;
  setPlayers: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  onClose: () => void;
  isOpened: boolean;
}) {
  const playerInputRef = useRef<HTMLInputElement>(null);

  function addPlayer() {
    if (!playerInputRef.current || !playerInputRef.current.value) return;
    const name = playerInputRef.current.value;
    setPlayers((list) => {
      if (list.get(name)) return list;
      const newList = new Map(list);
      newList.set(name, 0);
      return newList;
    });
    playerInputRef.current.value = '';
  }

  function deletePlayer(name: string) {
    setPlayers((players) => {
      const newPlayers = new Map(players);
      newPlayers.delete(name);
      return newPlayers;
    });
  }

  function resetScores() {
    setPlayers(players => {
      const newPlayers = new Map(players);
      newPlayers.forEach((_, key) => {
        newPlayers.set(key, 0);
      });
      return newPlayers;
    })
  }

  return (
    <Modal.Root fullScreen opened={isOpened} onClose={onClose} centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header maw={500} mx={'auto'}>
          <Modal.Title>
            <Title>Manage Players</Title>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body maw={500} mx={'auto'}>
          <Stack mb={2} h={'80dvh'}>
            <TextInput ref={playerInputRef} size='xl' placeholder='Name'></TextInput>
            <Button onClick={addPlayer} size='md'>
              Add
            </Button>
            {Array.from(players).map(([player, score]) => (
              <Flex justify={'space-between'} align={'center'} key={player}>
                <Flex style={{ flex: 1 }} mr={20} justify={'space-between'}>
                  <Text>{player}</Text>
                  <Text>{score}</Text>
                </Flex>
                <Flex gap={10}>
                  <Button color={'red'} onClick={() => deletePlayer(player)}>
                    <IconTrash></IconTrash>
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Stack>
          <Button w={'100%'} color='red' onClick={resetScores}>Reset Scores</Button>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
