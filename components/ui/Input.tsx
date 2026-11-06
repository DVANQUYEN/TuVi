import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref): React.ReactElement => {
    return (
      <input
        className={`
          flex h-11 w-full rounded-md border px-3 py-2 text-sm
          bg-surface text-foreground
          placeholder:text-muted
          focus:outline-none focus:ring-2
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-border-subtle focus:ring-gold'}
          disabled:cursor-not-allowed disabled:opacity-50
          sm:h-10
          ${className ?? ''}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
