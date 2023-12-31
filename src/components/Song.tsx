import { Box, Flex, Image, Text } from '@mantine/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { useContext } from 'react';
import { GameContext } from '../context';
import { displayArtist } from '../helper';

type Props = {
  song: Track;
  playlistId: string;
};

export default function Song(props: Props) {
  const { setCurrentSong, currentSong, audioPlayerRef, setModeConfig, modeConfig } = useContext(GameContext);

  const isCurrentSong = currentSong?.song.id === props.song.id;

  function onPreviewSong() {
    setCurrentSong({
      song: props.song,
      playlistId: props.playlistId,
    });
    setModeConfig({ ...modeConfig, showSong: true })
    setTimeout(() => {
      audioPlayerRef.current?.audio.current?.play();
    }, 500)
  }

  return (
    <Flex justify={'space-between'} align={'center'}>
      <Box key={props.song.id} mr={5}>
        <Text
          size='xl'
          style={{
            textAlign: 'left',
            fontWeight: isCurrentSong ? 'bold' : 'normal',
            color: isCurrentSong ? 'orange' : undefined
          }}
          
        >
          {props.song.name}
        </Text>
        <Text style={{ textAlign: 'left', fontWeight: isCurrentSong ? 'bold' : 'normal', color: isCurrentSong ? 'orange' : undefined }} size='md'>
          {displayArtist(props.song.artists)}
        </Text>
      </Box>
      <Image
        src={props.song.album.images[props.song.album.images.length - 1].url}
        onClick={onPreviewSong}
      />
    </Flex>
  );
}
