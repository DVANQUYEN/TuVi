'use client';

import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { encodeChartUrl, generateChartId } from '@/lib/utils/share';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { useMemo, useState, useSyncExternalStore } from 'react';

const subscribeNoop = (): (() => void) => () => {};

function getOrigin(): string {
  return window.location.origin;
}

function getServerOrigin(): string {
  return '';
}

interface ShareModalProps {
  chart: ZiweiChart;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ chart, isOpen, onClose }: ShareModalProps): React.ReactElement | null {
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(subscribeNoop, getOrigin, getServerOrigin);

  const { shareUrl, ogImageUrl } = useMemo(() => {
    const shareData = {
      chartId: generateChartId(chart.birthInfo),
      birthInfo: chart.birthInfo,
      preferences: chart.appliedConfig,
    };

    const encoded = encodeChartUrl(shareData);
    const dataParam = encoded.split('?data=')[1] ?? '';

    return {
      shareUrl: origin ? `${origin}${encoded}` : '',
      ogImageUrl: `/api/og?data=${dataParam}`,
    };
  }, [chart, origin]);

  const handleCopy = async (): Promise<void> => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chia sẻ lá số">
      <div className="space-y-6">
        {ogImageUrl && (
          <div className="rounded-lg overflow-hidden border border-border-subtle">
            <Image
              src={ogImageUrl}
              alt="Xem trước hình ảnh chia sẻ"
              width={1200}
              height={630}
              className="w-full h-auto"
              unoptimized
            />
          </div>
        )}

        <div>
          <label htmlFor="share-url" className="block text-sm font-medium mb-2">
            Link chia sẻ
          </label>
          <div className="flex gap-2">
            <input
              id="share-url"
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-surface border border-border-subtle rounded text-sm"
              aria-label="Link chia sẻ"
            />
            <Button
              onClick={handleCopy}
              variant="primary"
              aria-label={copied ? 'Đã sao chép' : 'Sao chép link'}
            >
              {copied ? 'Đã sao!' : 'Sao chép'}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                '_blank'
              )
            }
            aria-label="Chia sẻ qua Facebook"
          >
            Facebook
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Lá số Tử Vi')}`,
                '_blank'
              )
            }
            aria-label="Chia sẻ qua Twitter"
          >
            Twitter
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              window.open(`https://zalo.me/share?link=${encodeURIComponent(shareUrl)}`, '_blank')
            }
            aria-label="Chia sẻ qua Zalo"
          >
            Zalo
          </Button>
        </div>
      </div>
    </Modal>
  );
}
