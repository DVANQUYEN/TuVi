import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SavedChartsList } from '@/components/storage/SavedChartsList';

export const metadata: Metadata = {
  title: 'Lá số đã lưu - Sao Mệnh',
  description: 'Quản lý danh sách lá số Tử Vi đã lưu',
};

export default function HoSoPage(): React.ReactElement {
  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-background/70">
      <Header />

      <main className="flex-1 px-4 py-6 md:py-8 lg:py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-center font-serif text-2xl font-bold text-foreground md:mb-8 md:text-3xl lg:text-4xl">
            Lá số <span className="text-gold">đã lưu</span>
          </h1>
          <SavedChartsList />
        </div>
      </main>

      <Footer />
    </div>
  );
}
