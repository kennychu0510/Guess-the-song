import { Episode, Track } from "@spotify/web-api-ts-sdk";

export function songIsTrack(item: Track | Episode): item is Track {
  return (item as Track).album !== undefined;
}

export function displayArtist(artists: Track["artists"]) {
  return artists.map((artist) => artist.name).join(", ");
}