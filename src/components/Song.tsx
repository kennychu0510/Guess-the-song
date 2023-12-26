import { Box, Flex, Image, Stack, Text } from '@mantine/core';
import { PlaylistedTrack, SimplifiedTrack, Track } from '@spotify/web-api-ts-sdk';
import React, { useContext } from 'react';
import { GameContext } from '../context';

type Props = {
  song: Track;
  playlistId: string;
};

export default function Song(props: Props) {
  const { setCurrentSong, player, currentSong } = useContext(GameContext);

  const isCurrentSong = currentSong?.song.id === props.song.id;

  return (
    <Flex justify={'space-between'} align={'center'}>
      <Box key={props.song.id}>
        <Text
          size='xl'
          style={{
            textAlign: 'left',
            fontWeight: isCurrentSong ? 'bold' : 'normal',
          }}
        >
          {props.song.name}
        </Text>
        <Text style={{ textAlign: 'left', fontWeight: isCurrentSong ? 'bold' : 'normal' }} size='md'>
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
        }}
      />
    </Flex>
  );
}
