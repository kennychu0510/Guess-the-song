import { Stack, Text } from '@mantine/core';
import React from 'react';

export default function ControlButtonWrapper({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Stack align='center' gap={5}>
      {children}
      <Text size='xs'>{label}</Text>
    </Stack>
  );
}
