'use client';

interface DateTimeSectionProps {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  dateError?: string;
  timeError?: string;
}

export default function DateTimeSection({ date, time, onDateChange, onTimeChange, dateError, timeError }: DateTimeSectionProps) {
  return (
    <div className="grid grid-cols-[1fr_132px] gap-3">
      <div>
        <div className={`relative h-[63px] rounded-[4px] border bg-white ${dateError ? 'border-red-300' : 'border-[#d6d7dc]'}`}>
          <span className="pointer-events-none absolute left-3 top-1/2 h-[13px] w-[12px] -translate-y-1/2 rounded-[2px] border-2 border-[#d3b44d]">
            <span className="absolute -top-[4px] left-[1px] h-[4px] w-[2px] rounded-full bg-[#d3b44d]" />
            <span className="absolute -top-[4px] right-[1px] h-[4px] w-[2px] rounded-full bg-[#d3b44d]" />
            <span className="absolute left-[2px] top-[4px] h-[2px] w-[2px] rounded-full bg-[#d3b44d]" />
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            aria-label="Pickup date"
            className="h-full w-full border-0 bg-transparent pl-9 pr-3 text-[14px] text-[#272a42] outline-none focus:ring-0"
          />
          {!date ? (
            <span className="pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 bg-white pr-2 text-[14px] text-[#aeb0b8]">
              05/13/2023
            </span>
          ) : null}
        </div>
        {dateError ? <p className="mt-1 text-xs text-red-600">{dateError}</p> : null}
      </div>
      <div>
        <div className={`relative h-[63px] rounded-[4px] border bg-white ${timeError ? 'border-red-300' : 'border-[#d6d7dc]'}`}>
          <span className="pointer-events-none absolute left-3 top-1/2 h-[13px] w-[13px] -translate-y-1/2 rounded-full border-2 border-[#d3b44d]">
            <span className="absolute left-[5px] top-[2px] h-[5px] w-[2px] rounded-full bg-[#d3b44d]" />
            <span className="absolute left-[5px] top-[6px] h-[2px] w-[4px] rounded-full bg-[#d3b44d]" />
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
