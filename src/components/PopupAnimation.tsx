import { Stack } from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';

export default function PopupAnimation({ animation, onEnded }: { animation: string | null; onEnded: () => void }) {
  return (
    <AnimatePresence>
      {animation && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Stack style={{ zIndex: 100, position: 'absolute', height: '100dvh', width: '100vw', top: 0, bottom: 0, left: 0, right: 0 }} justify='center' align='center'>
            <Stack p={20} style={{ borderRadius: 20 }} bg={'#333'} w={200} h={200} justify='center' align='center'>
              <Lottie animationData={animation} onLoopComplete={onEnded} />
            </Stack>
          </Stack>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
