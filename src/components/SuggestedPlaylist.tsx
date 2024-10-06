import { Button, Center, Flex, Image, Loader, Text } from '@mantine/core';
import { Playlist, SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { IconCheck, IconPlus } from '@tabler/icons-react';
import usePlaylistContext from '../hooks/usePlaylistContext';
import songPlaceholder from '../assets/song_placeholder.png';

export default function SuggestedPlaylist({
  isLoading,
  items,
  currentPlaylist,
  addPlaylist,
}: {
  isLoading: boolean;
  items: SimplifiedPlaylist[];
  currentPlaylist: Map<string, Playlist>;
  addPlaylist: (id: string) => void;
}) {
  const playlistManager = usePlaylistContext()
  if (isLoading)
    return (
      <Center>
        <Loader />
      </Center>
    );

    function getSongImageUrl(item: SimplifiedPlaylist) {
      if (!item.images) return songPlaceholder;
      return item.images.length > 0 && item.images[0].url !== null ? item.images[0].url : songPlaceholder;
    }

  return (
    <>
      {items.map((item) => (
        <Flex key={item.id} justify={'space-between'} align={'center'}>
          <Flex align={'center'} gap={20} mr={20}>
            <Image src={getSongImageUrl(item)} w={80} h={80} />
            <Text size={'md'}>{item.name}</Text>
          </Flex>
          {currentPlaylist.get(item.id) ? (
            <Button color='green' style={{flexShrink: 0}}>
              <IconCheck />
            </Button>
          ) : (
            <Button loading={playlistManager?.playlistResult.isLoading && playlistManager.playlistInput === item.id} onClick={() => addPlaylist(item.id)} style={{flexShrink: 0}}>
              <IconPlus />
            </Button>
          )}
        </Flex>
      ))}
    </>
  );
}
