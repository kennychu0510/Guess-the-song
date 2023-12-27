import { AuthorizationCodeWithPKCEStrategy, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useCallback, useEffect, useState } from 'react';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const scope = ['playlist-read-private'];

export default function useSpotifyManager() {
  const [isActive, setIsActive] = useState(false);
  const [sdk, setSdk] = useState<null | SpotifyApi>(null);

  const redirectUrl = window.location.origin + '/';
  const code = new URLSearchParams(window.location.search).get('code');

  const spotifyAuthenticate = useCallback(async () => {
    const auth = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUrl, scope);
    const internalSdk = new SpotifyApi(auth);

    try {
      const { authenticated } = await internalSdk.authenticate();

      if (authenticated) {
        setSdk(() => internalSdk);
      }
    } catch (e: Error | unknown) {
      const error = e as Error;
      if (error && error.message && error.message.includes('No verifier found in cache')) {
        console.error(
          "If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).",
          error
        );
      } else {
        console.error(e);
      }
    }
  }, [setSdk, redirectUrl]);

  useEffect(() => {
    if (!code || sdk) return;
    spotifyAuthenticate();
  }, [code, spotifyAuthenticate, sdk]);

  useEffect(() => {
    if (!isActive) return;
    (async () => {
      await spotifyAuthenticate();
    })();
  }, [redirectUrl, isActive, spotifyAuthenticate]);

  

  function getToken() {
    setIsActive(true);
  }

  function logout() {
    setSdk(null);
    setIsActive(false);
  }

  return {
    sdk,
    getToken,
    logout,
  };
}
