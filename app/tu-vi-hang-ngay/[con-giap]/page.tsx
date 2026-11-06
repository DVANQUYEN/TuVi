import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DailyCard } from '@/components/horoscope/DailyCard';
import { BRANCH_NAMES, generateDailyHoroscope } from '@/lib/ziwei/daily';
import type { EarthlyBranch } from '@/lib/ziwei/types/enums';
import { EARTHLY_BRANCHES } from '@/lib/ziwei/types/enums';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import type { Metadata } from 'next';

// Trang đọc params động: cho phép block prerender (cùng quy ước với app/chia-se)
export const instant = false;

export function generateStaticParams(): { 'con-giap': EarthlyBranch }[] {
  return EARTHLY_BRANCHES.map((branch) => ({ 'con-giap': branch }));
}

interface PageProps {
  params: Promise<{ 'con-giap': string }>;
}

const VALID_BRANCHES = new Set<string>(EARTHLY_BRANCHES);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const branch = p['con-giap'];

  if (!VALID_BRANCHES.has(branch)) {
    return { title: 'Không tìm thấy' };
  }

  const name = BRANCH_NAMES[branch as EarthlyBranch];

  return {
    title: `Tử vi hàng ngày - Tuổi ${name}`,
    description: `Xem tử vi ngày hôm nay cho người tuổi ${name}`,
  };
}

// Ngày hiện tại chỉ được tính lúc có request, nên tách vào component con trong Suspense
async function TodayHoroscope({ branch }: { branch: EarthlyBranch }): Promise<React.ReactElement> {
  await connection();
  return <DailyCard horoscope={generateDailyHoroscope(branch)} />;
}

export default async function TuViChiTietPage({ params }: PageProps): Promise<React.ReactElement> {
  const p = await params;
  const branch = p['con-giap'];

  if (!VALID_BRANCHES.has(branch)) {
    notFound();
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-background/70">
      <Header />

      <main className="container mx-auto max-w-2xl flex-1 px-4 py-8">
        <Suspense
          fallback={
            <p role="status" className="text-center text-muted">
              Đang tải...
            </p>
          }
        >
          <TodayHoroscope branch={branch as EarthlyBranch} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
