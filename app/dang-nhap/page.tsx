import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Đăng nhập - Sao Mệnh',
  description: 'Đăng nhập để lưu và đồng bộ lá số Tử Vi',
};

export default function DangNhapPage(): React.ReactElement {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">Đăng nhập</h1>
      <LoginForm />
    </div>
  );
}
