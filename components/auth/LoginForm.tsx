'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase/use-auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await signUp(email, password);
        if (signUpError) throw signUpError;

        if (data.session) {
          router.push('/ho-so');
        } else {
          setSuccess(true);
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        router.push('/ho-so');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <p className="text-sm text-gold" role="status">
          Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.
        </p>
        <Button
          type="button"
          className="w-full"
          onClick={() => {
            setSuccess(false);
            setIsSignUp(false);
          }}
        >
          Quay lại đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
          Mật khẩu
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          required
          minLength={6}
        />
      </div>
      {error && (
        <div className="text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Đang xử lý...' : isSignUp ? 'Đăng ký' : 'Đăng nhập'}
      </Button>
      <button
        type="button"
        onClick={() => {
          setIsSignUp((previous) => !previous);
          setError('');
        }}
        className="text-sm text-gold hover:underline"
      >
        {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
      </button>
    </form>
  );
}
