import { Text, Image } from '@mantine/core';
import trophy from '../assets/trophy.png';

export function RankingDisplay({ index }: { index: number }) {
  if (index === 0) return <Image src={trophy} w={20} h={20} />;
  return (
    <Text w={20} style={{ textAlign: 'center' }}>
      {' '}
      {index + 1}{' '}
    </Text>
  );
}
