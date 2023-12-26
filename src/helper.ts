import { Episode, Track } from "@spotify/web-api-ts-sdk";

export function songIsTrack(item: Track | Episode): item is Track {
  return (item as Track).album !== undefined;
}