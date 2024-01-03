import { Box, Flex, Image, Text } from '@mantine/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { useContext } from 'react';
import { GameContext } from '../context';

type Props = {
  song: Track;
  playlistId: string;
};

export default function Song(props: Props) {
  const { setCurrentSong, currentSong, audioPlayerRef } = useContext(GameContext);

  const isCurrentSong = currentSong?.song.id === props.song.id;

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
          {props.song.artists.map((item) => item.name).join(', ')}
        </Text>
      </Box>
      <Image
        src={props.song.album.images[props.song.album.images.length - 1].url}
        onClick={() => {
          setCurrentSong({
            song: props.song,
            playlistId: props.playlistId,
          });
          setTimeout(() => {
            audioPlayerRef.current?.audio.current?.play();
          }, 500)
        }}
      />
    </Flex>
  );
}
