import { decodeChartUrl } from '@/lib/utils/share';
import { createChartEngine } from '@/lib/ziwei';
import { ZiweiBoard } from '@/components/chart/ZiweiBoard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const instant = false;

interface PageProps {
  params: Promise<{ chartId: string }>;
  searchParams: Promise<{ data?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const data = params.data;

  if (!data) {
    return { title: 'Chia sẻ lá số' };
  }

  const shareData = decodeChartUrl(data);
  if (!shareData) {
    return { title: 'Lá số không hợp lệ' };
  }

  const engine = createChartEngine();
  const chart = engine.generateChart(shareData.birthInfo, shareData.preferences);

  return {
    title: `Lá số Tử Vi - ${chart.birthInfo.name || 'Đương số'}`,
    description: `Lá số Tử Vi ${chart.birthInfo.name || ''} - ${chart.heavenPlate.napAm.name}`,
    openGraph: {
      title: `Lá số Tử Vi - ${chart.birthInfo.name || 'Đương số'}`,
      description: `${chart.heavenPlate.napAm.name} - ${chart.heavenPlate.fiveElementsClass.name}`,
      images: [`/api/og?data=${data}`],
    },
  };
}

export default async function ChiaSePage({
  params: _params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  await _params;
  const sp = await searchParams;
  const data = sp.data;

  if (!data) {
    notFound();
  }

  const shareData = decodeChartUrl(data);
  if (!shareData) {
    notFound();
  }

  const engine = createChartEngine();
  const chart = engine.generateChart(shareData.birthInfo, shareData.preferences);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Lá Số Tử Vi - {chart.birthInfo.name || 'Đương số'}
      </h1>

      <ZiweiBoard chart={chart} />

      <div className="mt-8 text-center">
        <a href="/lap-la-so" className="text-gold hover:underline">
          ← Lập lá số khác
        </a>
      </div>
    </div>
  );
}
