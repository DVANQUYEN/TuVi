'use client';

import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function SignUpPage(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch {
      setError('Không thể đăng ký. Vui lòng kiểm tra thông tin và kết nối mạng rồi thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center bg-background/70">
      <div className="w-full max-w-md p-8">
        <h1 className="mb-8 text-center font-heading text-3xl text-gold">Đăng ký tài khoản</h1>

        {success ? (
          <div className="text-center">
            <h2 className="mb-4 font-heading text-2xl text-gold">Thành công!</h2>
            <p className="text-gold/60">Kiểm tra email để xác nhận.</p>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-gold/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="w-full rounded border border-gold/30 bg-surface px-4 py-2 text-gold"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-gold/80">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full rounded border border-gold/30 bg-surface px-4 py-2 text-gold"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-gold py-2 font-heading text-surface hover:bg-gold/90 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>

            <p className="mt-4 text-center text-sm text-gold/60">
              Đã có tài khoản?{' '}
              <a href="/dang-nhap" className="text-gold hover:underline">
                Đăng nhập
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
