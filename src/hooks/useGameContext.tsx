import { useContext } from 'react';
import { GameContext } from '../context';

export default function useGameContext() {
  const gameContext = useContext(GameContext);
  return gameContext;
}
