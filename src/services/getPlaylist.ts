import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const clientSecret = import.meta.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const clientId = import.meta.env.REACT_APP_SPOTIFY_CLIENT_ID;

const sdk = SpotifyApi.withClientCredentials(clientId!, clientSecret!);

export async function getPlaylistById({ id }: { id: string }) {
  try {
    const result = await sdk.playlists.getPlaylist(id);
    return result;
  } catch (error) {
    return null;
  }
}

// export async function getAccessCode() {
//   try {
//     const result = await spotifyHelper.clientCredentialsGrant();
//     return result.body.access_token;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }
