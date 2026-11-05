import { connection } from 'next/server';
import { LapLaSoClient } from './LapLaSoClient';

export const instant = false;

interface PageProps {
  searchParams: Promise<{ savedId?: string | string[] }>;
}

export default async function LapLaSoPage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  await connection();

  const params = await searchParams;
  const savedId = typeof params.savedId === 'string' ? params.savedId : undefined;

  return <LapLaSoClient key={savedId ?? 'new'} savedId={savedId} />;
}
