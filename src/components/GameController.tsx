import { Box, Button, Flex, Stack, Text } from '@mantine/core';
import { Playlist, Track } from '@spotify/web-api-ts-sdk';
import { IconArrowsShuffle, IconMusic, IconMusicPause, IconPlayerPlay, IconPlayerTrackNext, IconRefresh } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { BOTTOM_TAB_HEIGHT, MAX_PLAY_DURATION } from '../constants';
import { GameContext } from '../context';
import { displayArtist, songIsTrack } from '../helper';
import ControlButtonWrapper from './ControlButtonWrapper';
import classes from './GameController.module.css';
import _ from 'lodash';
import AnswerModal from './AnswerModal';

type TrackSequence = {
  playlistId: string;
  trackIndex: number;
};

export default function GameController({ playlist, goToPlaylistManager }: { playlist: Map<string, Playlist>; goToPlaylistManager: () => void }) {
  const {
    setCurrentSong,
    audioPlayerRef,
    currentSong,
    playDuration,
    gameMode,
    modeConfig,
    setModeConfig,
  } = useContext(GameContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomSequence, setRandomSequence] = useState<TrackSequence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [startFrom, setStartFrom] = useState(0);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [possibleAnswers, setPossibleAnswers] = useState<Track[]>([]);

  function pauseSong() {
    audioPlayerRef.current?.audio.current?.pause();
  }

  function playSong() {
    audioPlayerRef.current?.audio.current?.play();
  }

  function setSongDisplayTrue() {
    setModeConfig({ ...modeConfig, showSong: true });
  }

  function setSongDisplayFalse() {
    setModeConfig({ ...modeConfig, showSong: false });
  }

  function playRandomSong() {
    const currentSong = randomSequence[currentIndex];
    const song = playlist.get(currentSong.playlistId)?.tracks.items[currentSong.trackIndex].track;
    if (song && songIsTrack(song)) {
      if (gameMode === 'Host') {
        setSongDisplayTrue();
      } else {
        setSongDisplayFalse();
      }
      setCurrentSong({
        song,
        playlistId: randomSequence[currentIndex].playlistId,
      });
      setCurrentIndex((index) => {
        if (index >= randomSequence.length) return 0;
        return index + 1;
      });
      const randomStart = getRandomStartTime(MAX_PLAY_DURATION, playDuration);
      setStartFrom(randomStart);
      setPossibleAnswers(() => {
        const remainingSongs = randomSequence.filter((item) => item.trackIndex !== currentSong.trackIndex);
        const correctAnswer = playlist.get(currentSong.playlistId)?.tracks.items[currentSong.trackIndex].track as Track;
        const shuffledSongs = _.shuffle(remainingSongs);
        const wrongAnswers = shuffledSongs.slice(0, modeConfig.numOfAns).map((item) => playlist.get(item.playlistId)?.tracks.items[item.trackIndex].track as Track);
        const answers = _.shuffle([correctAnswer, ...wrongAnswers]);
        return answers;
      });
      console.log('play song from', randomStart + 's');

      if (!isPlaying) {
        setTimeout(() => {
          playSong();
        }, 500);
      }
    }
  }

  useEffect(() => {
    if (playlist.size === 0) return;
    const sequence: TrackSequence[] = [];
    for (const p of playlist.values()) {
      const playlistId = p.id;
      p.tracks.items.forEach((_, i) => {
        sequence.push({ playlistId, trackIndex: i });
      });
    }
    const randomSequence = sequence.sort(() => Math.random() - 0.5);
    setRandomSequence(randomSequence);
    setCurrentIndex(0);
  }, [playlist]);

  function onPlay() {
    audioPlayerRef.current!.audio.current!.currentTime = startFrom;
    setIsPlaying(true);
    const time = new Date();
    time.setSeconds(time.getSeconds() + playDuration);
    setStartTime(Date.now());
  }

  function playRandomSection() {
    setStartFrom(getRandomStartTime(MAX_PLAY_DURATION, playDuration));
    playSong();
  }

  function onPause() {
    setIsPlaying(false);
  }

  useEffect(() => {
    if (gameMode === 'Host') {
      setSongDisplayTrue();
    } else {
      setSongDisplayFalse();
    }
  }, [gameMode]);

  function onAnswer() {
    setShowAnswerModal(true);
  }

  function onDoneAnswer() {
    setShowAnswerModal(false);
    setSongDisplayTrue();
  }

  return (
    <Box bottom={0} pos={'fixed'} left={0} right={0}>
      <Stack align='center' justify='center' h={BOTTOM_TAB_HEIGHT} w={'100%'} bg={'#333'} p={25} pt={10} mx={'auto'} gap={0}>
        {currentSong !== null && playlist.size > 0 && (
          <Stack style={{ flex: 1 }} justify='center'>
            {modeConfig.showSong ? (
              <Text c='white' style={{ textAlign: 'center' }} className={classes.SongDisplay}>
                {currentSong?.song.name} - {displayArtist(currentSong?.song.artists)}
              </Text>
            ) : (
              <Stack align='center'>
                {gameMode === 'No Host' ? (
                  <Button onClick={setSongDisplayTrue}>Review Answer</Button>
                ) : (
                  <Button onClick={onAnswer} color={'green'}>
                    Answer
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        )}
        <Flex gap={20} h={60} align={'center'}>
          {playlist.size === 0 ? (
            <Button rightSection={<IconMusic />} onClick={goToPlaylistManager}>
              Add a Playlist
            </Button>
          ) : (
            <>
              {isPlaying ? (
                <ControlButtonWrapper label='Pause'>
                  <Button onClick={pauseSong} color='red'>
                    <IconMusicPause />
                  </Button>
                </ControlButtonWrapper>
              ) : (
                currentSong !== null && (
                  <>
                    <ControlButtonWrapper label='Replay'>
                      <Button onClick={playSong} color='green'>
                        <IconRefresh />
                      </Button>
                    </ControlButtonWrapper>
                    <ControlButtonWrapper label='New Section'>
                      <Button onClick={playRandomSection} color='orange'>
                        <IconPlayerTrackNext />
                      </Button>
                    </ControlButtonWrapper>
                  </>
                )
              )}
              {currentSong === null ? (
                <ControlButtonWrapper label='Start Game'>
                  <Button onClick={playRandomSong}>
                    <IconPlayerPlay />
                  </Button>
                </ControlButtonWrapper>
              ) : (
                <ControlButtonWrapper label='Random'>
                  <Button onClick={playRandomSong}>
                    <IconArrowsShuffle />
                  </Button>
                </ControlButtonWrapper>
              )}
              <AudioPlayer
                src={currentSong?.song.preview_url ?? ''}
                ref={audioPlayerRef}
                showDownloadProgress={true}
                autoPlay
                onPlay={onPlay}
                onPause={onPause}
                onEnded={() => setIsPlaying(false)}
                onPlayError={() => setIsPlaying(false)}
                onListen={() => {
                  const currentTime = Date.now();
                  if (currentTime - startTime > playDuration * 1000) {
                    pauseSong();
                  }
                }}
                header={
                  <Text size={'xl'} c='black'>
                    {currentSong?.song.name} - {currentSong?.song.artists.map((item) => item.name).join(', ')}
                  </Text>
                }
                // style={{ opacity: 1, position: 'absolute', zIndex: -1, left: 0, top: -250 }}
                style={{ opacity: 0, position: 'absolute', zIndex: -1, left: 0 }}
              />
            </>
          )}
        </Flex>
      </Stack>
      {!!currentSong?.song && <AnswerModal answer={currentSong?.song} options={possibleAnswers} close={() => setShowAnswerModal(false)} opened={showAnswerModal} onDoneAnswer={onDoneAnswer} />}
    </Box>
  );
}

function getRandomStartTime(maxDuration: number, playDuration: number) {
  return Math.floor(Math.random() * (maxDuration - playDuration));
}
