'use client';

import { Button } from '@/components/ui/Button';
import type { ZiweiChart } from '@/lib/ziwei/types';

interface PdfButtonProps {
  chart: ZiweiChart;
}

export function PdfButton({ chart }: PdfButtonProps): React.ReactElement {
  const handleExport = async (): Promise<void> => {
    const element = document.getElementById('ziwei-board');
    if (!element) return;

    const filename = `la-so-${chart.birthInfo.name || 'duong-so'}.pdf`;

    try {
      // Lazy load the browser-only export module
      const { exportToPdf } = await import('@/lib/pdf/export');
      await exportToPdf(element, filename);
    } catch (error) {
      console.error('Failed to capture board, falling back to vector PDF:', error);

      const { generateChartPdf } = await import('@/lib/utils/pdf');
      const blob = generateChartPdf(chart);
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Button variant="secondary" onClick={handleExport} aria-label="Xuất lá số dạng PDF">
      📄 Xuất PDF
    </Button>
  );
}
