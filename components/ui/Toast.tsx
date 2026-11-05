'use client';

import { useEffect, useState, type ReactNode } from 'react';

export interface ToastProps {
  message: ReactNode;
  duration?: number;
  onClose?: () => void;
  variant?: 'success' | 'error' | 'info';
}

export function Toast({
  message,
  duration = 3000,
  onClose,
  variant = 'info',
}: ToastProps): React.ReactElement | null {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return (): void => window.clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const variantClasses = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-gold text-background',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 rounded-md px-4 py-3 shadow-lg ${variantClasses[variant]}`}
    >
      {message}
    </div>
  );
}
