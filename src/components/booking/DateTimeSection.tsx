'use client';

interface DateTimeSectionProps {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  dateError?: string;
  timeError?: string;
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" className="h-[15px] w-[15px]" viewBox="0 0 16 16" fill="none">
      <path d="M5 1.8v2M11 1.8v2M2.7 6h10.6M3.5 3.3h9c.7 0 1.3.6 1.3 1.3v8c0 .7-.6 1.3-1.3 1.3h-9c-.7 0-1.3-.6-1.3-1.3v-8c0-.7.6-1.3 1.3-1.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.1 8.5h.1M8 8.5h.1M10.9 8.5h.1M5.1 11.1h.1M8 11.1h.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="h-[15px] w-[15px]" viewBox="0 0 16 16" fill="none">
      <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5.2V8l2 1.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A compact date/time section for pickup scheduling.
 *
 * This component centralizes both controls so there is a single place to
 * adapt the UI for timezone-aware dates, alternate calendar pickers, or
 * validation changes.
 */
export default function DateTimeSection({ date, time, onDateChange, onTimeChange, dateError, timeError }: DateTimeSectionProps) {
  return (
    <div className="grid grid-cols-[1fr_132px] gap-3">
      <div>
        <div className={`relative h-[63px] rounded-[4px] border bg-white ${dateError ? 'border-red-300' : 'border-[#d6d7dc]'}`}>
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#d3b44d]">
            <CalendarIcon />
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            aria-label="Pickup date"
            className="h-full w-full border-0 bg-transparent pl-9 pr-3 text-[14px] text-[#272a42] outline-none focus:ring-0"
          />
          {!date ? (
            <span className="pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 bg-white pr-2 text-[15px] text-[#aeb0b8]">
              05/13/2023
            </span>
          ) : null}
        </div>
        {dateError ? <p className="mt-1 text-xs text-red-600">{dateError}</p> : null}
      </div>
      <div>
        <div className={`relative h-[63px] rounded-[4px] border bg-white ${timeError ? 'border-red-300' : 'border-[#d6d7dc]'}`}>
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#d3b44d]">
            <ClockIcon />
          </span>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            aria-label="Pickup time"
            className="h-full w-full border-0 bg-transparent pl-8 pr-2 text-[14px] text-[#272a42] outline-none focus:ring-0"
          />
          {!time ? (
            <span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 bg-white pr-2 text-[14px] text-[#aeb0b8]">
              3:00 PM
            </span>
          ) : null}
        </div>
        {timeError ? <p className="mt-1 text-xs text-red-600">{timeError}</p> : null}
      </div>
    </div>
  );
}
