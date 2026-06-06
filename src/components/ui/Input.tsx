import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Standard text input with label and inline error handling.
 *
 * This component is intended for simple form fields where the label floats
 * above the input. More complex field layouts should use custom components.
 */
export default function Input({ label, error, className = '', ...props }: InputProps) {
  const icon = label.toLowerCase().includes('email') ? '@' : '';

  return (
    <div className={`relative ${className}`}>
      <label className="absolute -top-2 left-3 z-10 bg-white px-1 text-[11px] leading-4 text-[#74758a]">{label}</label>
      {icon ? (
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[15px] font-semibold text-[#d2b34c]">
          {icon}
        </span>
      ) : (
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 h-[12px] w-[12px] -translate-y-1/2 text-[#d2b34c]">
          <span className="absolute left-[4px] top-0 h-[5px] w-[5px] rounded-full bg-current" />
          <span className="absolute bottom-0 left-[2px] h-[5px] w-[9px] rounded-t-full bg-current" />
        </span>
      )}
      <input
        className={`h-[38px] w-full rounded-[4px] border border-[#cfd1d8] bg-white px-8 py-2 text-[14px] text-[#272a42] outline-none transition placeholder:text-[#aeb0b8] focus:border-[#d3b44d] focus:ring-1 focus:ring-[#d3b44d]/30 ${error ? 'border-red-300' : ''}`}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
