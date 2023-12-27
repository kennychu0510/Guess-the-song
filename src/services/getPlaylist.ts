import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export async function getPlaylistById({ id, sdk }: { id: string, sdk: SpotifyApi }) {
  try {
    const result = await sdk.playlists.getPlaylist(id);
    return result;
  } catch (error) {
    return null;
  }
}