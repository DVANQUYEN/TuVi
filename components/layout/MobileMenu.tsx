'use client';

import { type MouseEvent as ReactMouseEvent, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export function MobileMenu({ isOpen, onClose, links }: MobileMenuProps): React.ReactElement | null {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Tab') {
        const focusableElements = overlayRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>): void => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      role="presentation"
      className="fixed inset-0 z-[60] bg-black/65 lg:hidden"
      onClick={handleOverlayClick}
    >
      <div
        id="mobile-menu"
        className="fixed inset-y-0 right-0 z-[70] h-[100dvh] max-h-[100dvh] w-72 max-w-[85vw] overflow-y-auto overscroll-contain border-l border-border-subtle bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-4">
          <span className="font-serif text-xl font-bold text-gold">Sao Mệnh</span>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            aria-label="Đóng menu"
            onClick={onClose}
            className="shrink-0 p-0"
            style={{ height: 44, width: 44 }}
          >
            ✕
          </Button>
        </div>

        <nav className="flex flex-col p-4">
          {links.map((link) => {
            const isActive =
              link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href) === true;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center rounded-md px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isActive
                    ? 'bg-elevated font-semibold text-gold'
                    : 'text-foreground hover:bg-elevated hover:text-gold'
                }`}
                onClick={onClose}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
