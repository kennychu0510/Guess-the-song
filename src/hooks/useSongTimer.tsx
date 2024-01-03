import { useTimer } from 'react-timer-hook';

export default function useSongTimer({ pauseSong, expiryTimestamp }: { pauseSong: () => void; expiryTimestamp: Date }) {
  const timer = useTimer({ expiryTimestamp, onExpire: () => pauseSong() });
  return timer;
}
