import { Accordion, Select, Stack, Text, Title } from '@mantine/core';
import { CountryCodeA2, Playlist, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { SPOTIFY_COUNTRIES } from '../constants';
import SuggestedPlaylist from './SuggestedPlaylist';

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
  
  function isPlaylistValid(playlist: any) {
    return playlist !== null && Array.isArray(playlist);
  }

  return (
    <><Title size={'h2'}>Quick add</Title><Accordion>
      <Accordion.Item value='Personal Playlist'>
        <Accordion.Control>
          <Text>Personal Playlist</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <SuggestedPlaylist isLoading={featuredPlaylists.isLoading} items={isPlaylistValid(personalPlaylist.data?.items) ? personalPlaylist.data?.items : []} currentPlaylist={currentPlaylist} addPlaylist={addPlaylist} />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value='Suggested Playlist'>
        <Accordion.Control>
          <Text>By Country</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <Select size='md' value={country} onChange={setCountry} placeholder='Select a Country' searchable data={SPOTIFY_COUNTRIES} />
            <SuggestedPlaylist isLoading={featuredPlaylists.isLoading} items={isPlaylistValid(playlist) ? playlist : []} currentPlaylist={currentPlaylist} addPlaylist={addPlaylist} />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion></>
  );
}
