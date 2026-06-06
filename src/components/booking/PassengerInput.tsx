'use client';

interface PassengerInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  error?: string;
}

/**
 * Simple passenger count input.
 *
 * Keeping this as a separate component makes it easy to enhance the input with
 * recommended passenger limits, validation hints, or alternate controls in the future.
 */
export default function PassengerInput({ value, onChange, error }: PassengerInputProps) {
  return (
    <div>
      <label className="mb-4 block text-[13px] font-normal leading-5 text-[#15172f]">How many passengers are expected for the trip?</label>
      <div className="relative w-[185px]">
        <label className="absolute -top-2 left-3 z-10 bg-white px-1 text-[11px] leading-4 text-[#74758a]"># Passengers</label>
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[15px] font-semibold text-[#d3b44d]">#</span>
        <input
          type="number"
          min={1}
          max={20}
          value={value ?? ''}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`h-[38px] w-full rounded-[4px] border bg-white py-2 pl-8 pr-3 text-[14px] text-[#272a42] outline-none transition focus:border-[#d3b44d] focus:ring-1 focus:ring-[#d3b44d]/30 ${error ? 'border-red-300' : 'border-[#cfd1d8]'}`}
        />
      </div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
