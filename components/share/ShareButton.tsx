'use client';

import { Button } from '@/components/ui/Button';
import { ShareModal } from './ShareModal';
import { useState } from 'react';
import type { ZiweiChart } from '@/lib/ziwei/types';

interface ShareButtonProps {
  chart: ZiweiChart;
}

export function ShareButton({ chart }: ShareButtonProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)} aria-label="Chia sẻ lá số">
        Chia sẻ
      </Button>
      <ShareModal chart={chart} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
