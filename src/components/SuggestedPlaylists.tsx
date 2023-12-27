import { Accordion, Button, Flex, Image, Stack, Title, Text, Select, Loader, Center } from '@mantine/core';
import { CountryCodeA2, Playlist, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { IconCheck, IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { SPOTIFY_COUNTRIES } from '../constants';
import { useState } from 'react';

export default function SuggestedPlaylists({ sdk, addPlaylist, currentPlaylist }: { sdk: SpotifyApi; addPlaylist: (id: string) => void; currentPlaylist: Map<string, Playlist> }) {
  const [country, setCountry] = useState<string | null>(null);
  const featuredPlaylists = useQuery({
    queryKey: ['featuredPlaylists', country],
    queryFn: () => sdk.browse.getFeaturedPlaylists(country as CountryCodeA2),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
    enabled: country !== null,
  });
  const personalPlaylist = useQuery({
    queryKey: ['personalPlaylist'],
    queryFn: () => sdk.currentUser.playlists.playlists(),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });

  const playlist = featuredPlaylists.data?.playlists.items ?? [];

  return (
    <Accordion>
      <Accordion.Item value='Personal Playlist'>
        <Accordion.Control>
          <Text>Personal Playlist</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            {featuredPlaylists.isLoading ? (
              <Center>
                <Loader />
              </Center>
            ) : (
              personalPlaylist.data?.items.map((item) => (
                <Flex key={item.id} justify={'space-between'} align={'center'}>
                  <Flex align={'center'} gap={20}>
                    <Image src={item.images[0].url} w={80} h={80} />
                    <Title size={'h3'}>{item.name}</Title>
                  </Flex>
                  {currentPlaylist.get(item.id) ? (
                    <Button color='green'>
                      <IconCheck />
                    </Button>
                  ) : (
                    <Button onClick={() => addPlaylist(item.id)}>
                      <IconPlus />
                    </Button>
                  )}
                </Flex>
              ))
            )}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value='Suggested Playlist'>
        <Accordion.Control>
          <Text>Suggested Playlist</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <Select value={country} onChange={setCountry} label={'Country'} placeholder='Select a Country' searchable data={SPOTIFY_COUNTRIES} />
            {featuredPlaylists.isLoading ? (
              <Center>
                <Loader />
              </Center>
            ) : (
              playlist.map((item) => (
                <Flex key={item.id} justify={'space-between'} align={'center'}>
                  <Flex align={'center'} gap={20}>
                    <Image src={item.images[0].url} w={80} h={80} />
                    <Title size={'h3'}>{item.name}</Title>
                  </Flex>
                  {currentPlaylist.get(item.id) ? (
                    <Button color='green'>
                      <IconCheck />
                    </Button>
                  ) : (
                    <Button onClick={() => addPlaylist(item.id)}>
                      <IconPlus />
                    </Button>
                  )}
                </Flex>
              ))
            )}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
