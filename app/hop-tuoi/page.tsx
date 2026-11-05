import { CompatibilityForm } from '@/components/horoscope/CompatibilityForm';
import { ZodiacCompatibilitySection } from '@/components/horoscope/ZodiacCompatibilitySection';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tam hợp & Lục hợp - Sao Mệnh',
  description:
    'Xem tam hợp, lục hợp, tứ hành xung và mức độ hợp nhau giữa hai người theo Tử Vi Đẩu Số',
};

export default function HopTuoiPage(): React.ReactElement {
  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-background">
      <Header />

      <main className="container mx-auto max-w-3xl flex-1 px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Tam hợp & Lục hợp</h1>
          <p className="text-lg text-muted">Nhập thông tin của hai người để xem mức độ hợp nhau</p>
        </div>

        <CompatibilityForm />

        <div className="mt-12 border-t border-border-subtle pt-12">
          <ZodiacCompatibilitySection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
