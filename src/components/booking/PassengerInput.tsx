'use client';

import Input from '@/components/ui/Input';

interface PassengerInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  error?: string;
}

export default function PassengerInput({ value, onChange, error }: PassengerInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-800">How many passengers are expected for the trip?</label>
      <input
        type="number"
        min={1}
        max={20}
        value={value ?? ''}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 ${error ? 'border-red-300' : ''}`}
        placeholder="# Passengers"
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
