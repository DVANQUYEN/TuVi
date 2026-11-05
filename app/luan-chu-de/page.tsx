import type { Metadata } from 'next';
import { connection } from 'next/server';
import { LuanChuDeClient } from './LuanChuDeClient';

export const metadata: Metadata = {
  title: 'Luận theo chủ đề - Sao Mệnh',
  description: 'Luận giải Tử Vi theo từng chủ đề: sự nghiệp, tình duyên, tài lộc, sức khỏe',
};

// Đọc searchParams: cho phép block prerender (cùng quy ước với app/lap-la-so)
export const instant = false;

interface PageProps {
  searchParams: Promise<{ savedId?: string | string[] }>;
}

export default async function LuanChuDePage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  await connection();

  const params = await searchParams;
  const savedId = typeof params.savedId === 'string' ? params.savedId : undefined;

  return <LuanChuDeClient savedId={savedId} />;
}
