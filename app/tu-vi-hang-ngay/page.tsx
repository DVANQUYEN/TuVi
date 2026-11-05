import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DailyInfo } from '@/components/horoscope/DailyInfo';
import { ZodiacGrid } from '@/components/horoscope/ZodiacGrid';
import { generateDailyHoroscope } from '@/lib/ziwei/daily';
import { EARTHLY_BRANCHES } from '@/lib/ziwei/types/enums';
import type { Metadata } from 'next';
import { connection } from 'next/server';

export const metadata: Metadata = {
  title: 'Tử vi hàng ngày - 12 con giáp - Sao Mệnh',
  description: 'Xem tử vi hàng ngày theo 12 con giáp, cập nhật liên tục',
};

// Ngày hiện tại chỉ được tính lúc có request, nên tách vào component con trong Suspense
async function TodayZodiacGrid(): Promise<React.ReactElement> {
  await connection();
  const today = new Date();
  const horoscopes = EARTHLY_BRANCHES.map((branch) => generateDailyHoroscope(branch, today));
  return (
    <>
      <DailyInfo date={today} />
      <ZodiacGrid horoscopes={horoscopes} />
    </>
  );
}

export default function TuViHangNgayPage(): React.ReactElement {
  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-background">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-heading text-5xl font-semibold text-gold">Tử vi hàng ngày</h1>
          <p className="text-lg text-muted">Chọn con giáp của bạn để xem tử vi ngày hôm nay</p>
        </div>

        <Suspense
          fallback={
            <p role="status" className="text-center text-muted">
              Đang tải...
            </p>
          }
        >
          <TodayZodiacGrid />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
