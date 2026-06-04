'use client';

import type { ReactNode } from 'react';

interface CustomerLookupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  loading: boolean;
  message: string;
  error?: string;
  children: ReactNode;
}

export default function CustomerLookup({ label, value, onChange, onBlur, loading, message, error, children }: CustomerLookupProps) {
  const displayValue = value.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, '+1 $1 $2 $3');

  return (
    <div className="space-y-3">
      <div>
        <label className="sr-only">{label}</label>
        <div className="flex h-[38px] items-center gap-3 rounded-[4px] border border-[#cfd1d8] bg-white px-4 text-[14px] text-[#272a42]">
          <span className="relative h-[18px] w-[28px] overflow-hidden border border-[#e1e3e8] bg-white shadow-sm" aria-hidden="true">
            <span className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#c9243f_0,#c9243f_1.38px,#fff_1.38px,#fff_2.76px)]" />
            <span className="absolute left-0 top-0 h-[9.7px] w-[12px] bg-[#2955a3]" />
          </span>
          <input
            type="tel"
            value={displayValue}
            onChange={(event) => onChange(event.target.value.replace(/\s/g, ''))}
            onBlur={onBlur}
            placeholder="+1 774 415 3244"
            className="min-w-0 flex-1 border-0 bg-transparent px-0 text-[14px] outline-none placeholder:text-[#272a42] focus:ring-0"
          />
          {loading ? <span className="text-xs text-[#d3b44d]">Loading...</span> : null}
        </div>
      </div>
      <p className="text-[13px] leading-5 text-[#52526a]">{message}</p>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {children}
    </div>
  );
}
