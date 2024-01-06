import { Box, Button, Flex, Modal, Radio, Stack, Text, Title } from '@mantine/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import answerCorrectAnimation from '../assets/lottie/correct.json';
import answerWrongAnimation from '../assets/lottie/wrong.json';
import { displayArtist } from '../helper';
import useGameContext from '../hooks/useGameContext';
import classes from './AnswerModal.module.css';
import PopupAnimation from './PopupAnimation';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  answer: Track;
  options: Track[];
  opened: boolean;
  close: () => void;
  onDoneAnswer: () => void;
};

type Page = 'selectAnswer' | 'selectPlayer';

export default function AnswerModal(props: Props) {
  const { answer, options, opened, close, onDoneAnswer } = props;
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [animation, setAnimation] = useState<any>(null);
  const [page, setPage] = useState<Page>('selectAnswer');
  const { players, addScore } = useGameContext();

  useEffect(() => {
    setSelectedAnswer('');
  }, [options]);

  function onConfirm() {
    if (players.size === 0) {
      setAnimation(answer.id === selectedAnswer ? answerCorrectAnimation : answerWrongAnimation);
      return;
    }
    setPage('selectPlayer');
  }

  function onAnimationEnd() {
    setAnimation(null);
    setPage('selectAnswer');
    onDoneAnswer()
  }

  function onConfirmPlayer() {
    if (answer.id === selectedAnswer) {
      addScore(selectedPlayer, 1);
    } else {
      addScore(selectedPlayer, -1);
    }
    setAnimation(answer.id === selectedAnswer ? answerCorrectAnimation : answerWrongAnimation);
  }

  const selectedSong = options.find((item) => item.id === selectedAnswer);

  return (
    <Modal.Root fullScreen opened={opened} onClose={close} centered style={{ overflowX: 'hidden' }}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header maw={500} mx={'auto'}>
          <Modal.Title>
            <Title>Answer</Title>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body maw={500} mx={'auto'}>
          {page === 'selectAnswer' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: 'just',
              }}
            >
              <Stack className={classes.Page}>
                {options.map((option) => (
                  <Flex key={option.id} align={'center'} onClick={() => setSelectedAnswer(option.id)}>
                    <Box style={{ flex: 1 }}>
                      <Text fw={'bold'}>{option.name}</Text>
                      <Text size='sm'>{displayArtist(option.artists)}</Text>
                    </Box>
                    <Radio checked={selectedAnswer === option.id} onChange={() => setSelectedAnswer(option.id)} />
                  </Flex>
                ))}
                <Button onClick={onConfirm} mt={'auto'} disabled={selectedAnswer === ''}>
                  Confirm
                </Button>
              </Stack>
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: 'just',
                }}
              >
                <Stack className={classes.Page}>
                  <Stack gap={0} style={{ border: '1px solid white', borderRadius: 10, padding: 10 }}>
                    <Text style={{ textAlign: 'center' }} fw={'bold'}>
                      {selectedSong?.name}
                    </Text>
                    <Text style={{ textAlign: 'center' }} size='sm'>
                      {displayArtist(selectedSong?.artists ?? [])}
                    </Text>
                  </Stack>
                  <Text fw={'bold'}>Answering as:</Text>
                  {Array.from(players).map(([player]) => (
                    <Flex key={player} align={'center'} onClick={() => setSelectedPlayer(player)}>
                      <Box style={{ flex: 1 }}>
                        <Text>{player}</Text>
                      </Box>
                      <Radio checked={selectedPlayer === player} onChange={() => setSelectedPlayer(player)} />
                    </Flex>
                  ))}
                  <Flex mt={'auto'} justify={'space-between'}>
                    <Button onClick={() => setPage('selectAnswer')}>
                      <IconArrowLeft />
                    </Button>
                    <Button color='green' onClick={onConfirmPlayer}>
                      <IconCheck />
                    </Button>
                  </Flex>
                </Stack>
              </motion.div>
            </AnimatePresence>
          )}
        </Modal.Body>
        <PopupAnimation animation={animation} onEnded={onAnimationEnd} />
      </Modal.Content>
    </Modal.Root>
  );
}
