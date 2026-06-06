import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * Brand-safe button component.
 *
 * All buttons should use this component so styles and disabled behavior stay
 * consistent across the app. The wrapper also makes it easy to add shared
 * analytics/event tracking later.
 */
export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-[34px] items-center justify-center rounded-[3px] bg-[#d3b44d] px-5 text-[12px] font-bold text-white transition hover:bg-[#c5a63f] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
