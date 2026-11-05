'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface UserMenuProps {
  user: User;
  onSignOut: () => Promise<void>;
}

export function UserMenu({ user, onSignOut }: UserMenuProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const fullName =
    typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '';
  const label = fullName || user.email || 'Tài khoản';
  const initial = label.charAt(0).toUpperCase();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent): void => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return (): void => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSignOut = async (): Promise<void> => {
    await onSignOut();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-foreground transition-colors hover:text-gold"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="user-menu"
        aria-label={`Tài khoản của ${label}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-gold">
          {initial}
        </span>
        <span className="hidden max-w-[10rem] truncate lg:inline">{label}</span>
      </button>

      {isOpen && (
        <div
          id="user-menu"
          role="menu"
          aria-label="Menu tài khoản"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-md border border-border-subtle bg-surface shadow-lg"
        >
          <div className="border-b border-border-subtle px-4 py-3">
            <p className="truncate text-sm font-medium text-foreground">{label}</p>
            {user.email && <p className="truncate text-xs text-muted">{user.email}</p>}
          </div>
          <Link
            href="/ho-so"
            role="menuitem"
            className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-elevated hover:text-gold"
            onClick={() => setIsOpen(false)}
          >
            Quẻ đã lưu
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-elevated hover:text-gold"
            onClick={handleSignOut}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
