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
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-800">{label}</label>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm">
          <span className="flex h-8 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">🇺🇸</span>
          <input
            type="tel"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            placeholder="+1 774 415 3244"
            className="min-w-0 flex-1 border-0 bg-transparent px-0 text-sm outline-none focus:ring-0"
          />
          {loading ? <span className="text-brand-gold">Loading…</span> : null}
        </div>
      </div>
      <p className="text-sm leading-6 text-slate-600">{message}</p>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {children}
    </div>
  );
}
