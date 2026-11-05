import type { Metadata } from 'next';
import { connection } from 'next/server';
import { VanHanClient } from './VanHanClient';

export const metadata: Metadata = {
  title: 'Vận hạn - Sao Mệnh',
  description: 'Đại hạn, lưu niên và timeline vận hạn theo lá số Tử Vi',
};

// Đọc searchParams: cho phép block prerender (cùng quy ước với app/lap-la-so)
export const instant = false;

interface PageProps {
  searchParams: Promise<{ savedId?: string | string[] }>;
}

export default async function VanHanPage({ searchParams }: PageProps): Promise<React.ReactElement> {
  await connection();

  const params = await searchParams;
  const savedId = typeof params.savedId === 'string' ? params.savedId : undefined;

  return <VanHanClient savedId={savedId} />;
}
