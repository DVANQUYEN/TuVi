import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { User } from '@supabase/supabase-js';
import { LoginForm } from '@/components/auth/LoginForm';
import { UserMenu } from '@/components/auth/UserMenu';

const { pushMock, signInMock, signUpMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  signInMock: vi.fn(),
  signUpMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: (): { push: typeof pushMock } => ({ push: pushMock }),
  usePathname: (): string => '/',
}));

vi.mock('@/lib/supabase/use-auth', () => ({
  useAuth: (): { signIn: typeof signInMock; signUp: typeof signUpMock } => ({
    signIn: signInMock,
    signUp: signUpMock,
  }),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  pushMock.mockReset();
  signInMock.mockReset();
  signUpMock.mockReset();
});

describe('LoginForm', () => {
  it('submits credentials and redirects after a successful sign in', async () => {
    signInMock.mockResolvedValue({ data: {}, error: null });

    const { container } = render(<LoginForm />);

    fireEvent.change(container.querySelector('#email') as HTMLInputElement, {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(container.querySelector('#password') as HTMLInputElement, {
      target: { value: 'secret123' },
    });
    fireEvent.click(container.querySelector('button[type="submit"]') as HTMLButtonElement);

    await waitFor(() => expect(signInMock).toHaveBeenCalledWith('user@example.com', 'secret123'));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/ho-so'));
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('shows a localized sign-in error without leaking technical details', async () => {
    signInMock.mockResolvedValue({ data: {}, error: new Error('Invalid login credentials') });

    const { container } = render(<LoginForm />);

    fireEvent.change(container.querySelector('#email') as HTMLInputElement, {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(container.querySelector('#password') as HTMLInputElement, {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(container.querySelector('button[type="submit"]') as HTMLButtonElement);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Không thể đăng nhập');
    expect(alert).not.toHaveTextContent(/invalid login credentials/i);
    expect(alert).not.toHaveTextContent('email_not_confirmed');
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('shows a generic sign-up error that does not reveal account existence', async () => {
    signUpMock.mockResolvedValue({ data: {}, error: new Error('User already registered') });

    const { container } = render(<LoginForm />);

    fireEvent.click(container.querySelector('button[type="button"]') as HTMLButtonElement);
    fireEvent.change(container.querySelector('#email') as HTMLInputElement, {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(container.querySelector('#password') as HTMLInputElement, {
      target: { value: 'secret123' },
    });
    fireEvent.click(container.querySelector('button[type="submit"]') as HTMLButtonElement);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Không thể đăng ký');
    expect(alert).not.toHaveTextContent(/already registered/i);
    expect(alert).not.toHaveTextContent('email_exists');
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('switches to sign up mode and submits only email and password', async () => {
    signUpMock.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    });

    const { container } = render(<LoginForm />);

    fireEvent.click(container.querySelector('button[type="button"]') as HTMLButtonElement);
    expect(container.querySelector('#fullName')).toBeNull();
    fireEvent.change(container.querySelector('#email') as HTMLInputElement, {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(container.querySelector('#password') as HTMLInputElement, {
      target: { value: 'secret123' },
    });
    fireEvent.click(container.querySelector('button[type="submit"]') as HTMLButtonElement);

    await waitFor(() => expect(signUpMock).toHaveBeenCalledWith('user@example.com', 'secret123'));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/ho-so'));
  });

  it('shows the email confirmation message when sign up returns no session', async () => {
    signUpMock.mockResolvedValue({ data: { session: null }, error: null });

    const { container } = render(<LoginForm />);

    fireEvent.click(container.querySelector('button[type="button"]') as HTMLButtonElement);
    fireEvent.change(container.querySelector('#email') as HTMLInputElement, {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(container.querySelector('#password') as HTMLInputElement, {
      target: { value: 'secret123' },
    });
    fireEvent.click(container.querySelector('button[type="submit"]') as HTMLButtonElement);

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Vui lòng kiểm tra email để xác nhận tài khoản'
    );
    expect(pushMock).not.toHaveBeenCalled();
  });
});

describe('UserMenu', () => {
  const user = {
    id: 'user-1',
    email: 'user@example.com',
    user_metadata: { full_name: 'Nguyen A' },
  } as unknown as User;

  it('opens the account menu and signs out', async () => {
    const onSignOut = vi.fn().mockResolvedValue(undefined);

    const { container } = render(<UserMenu user={user} onSignOut={onSignOut} />);

    fireEvent.click(container.querySelector('button[aria-haspopup="menu"]') as HTMLButtonElement);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(container.textContent).toContain('user@example.com');

    const menuItems = screen.getAllByRole('menuitem');
    fireEvent.click(menuItems[menuItems.length - 1]);

    await waitFor(() => expect(onSignOut).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/'));
  });

  it('closes the account menu on Escape', () => {
    const onSignOut = vi.fn().mockResolvedValue(undefined);

    const { container } = render(<UserMenu user={user} onSignOut={onSignOut} />);

    fireEvent.click(container.querySelector('button[aria-haspopup="menu"]') as HTMLButtonElement);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
