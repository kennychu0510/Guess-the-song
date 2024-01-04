import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';

export default function InstallPWAButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useLocalStorage<boolean>({
    key: 'pwaInstalled',
    defaultValue: false,
  });

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      setPwaInstalled(false)

      if (event) {
        setShowButton(true);
        setInstallPrompt(event);
      }
    });
    window.addEventListener('appinstalled', () => {
      setPwaInstalled(true);
    })

    window.addEventListener('app', () => {
      setPwaInstalled(true);
    })

  }, []);

  async function installPWA() {
    if (!installPrompt) return;
    const result = await installPrompt.prompt();
    if (result.outcome === 'accepted') {
      setShowButton(false);
    }
  }

  if (pwaInstalled) return null;

  return (
    <Button onClick={installPWA} id='install' hidden={!showButton} color='black' rightSection={<IconDownload />}>
      Install App
    </Button>
  );
}
