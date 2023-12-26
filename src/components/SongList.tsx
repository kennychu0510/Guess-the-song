import { Flex, Stack, Text, Title } from '@mantine/core';
import { Playlist, Track } from '@spotify/web-api-ts-sdk';
import { songIsTrack } from '../helper';
import Song from './Song';

type Props = {
  playlist: Playlist | null | undefined;
};

export default function SongList(props: Props) {
  if (!props.playlist) return null;
  return (
    <>
      <Stack>
        <Flex justify={'space-between'} align={'flex-end'}>
          <Title size={'h2'}>{props.playlist.name}</Title>
          <Text style={{ textAlign: 'end' }}>TOTAL: {props.playlist.tracks.items.length}</Text>
        </Flex>
        {props.playlist.tracks.items
          .map((item) => item.track)
          .filter((item) => songIsTrack(item))
          .map((item) => (
            <Song song={item as Track} playlistId={props.playlist!.id} key={item.id} />
          ))}
      </Stack>
    </>
  );
}
