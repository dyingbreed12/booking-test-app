'use client';

import Input from '@/components/ui/Input';

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
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label="Pickup Date" type="date" value={date} onChange={(e) => onDateChange(e.target.value)} error={dateError} />
      <Input label="Pickup Time" type="time" value={time} onChange={(e) => onTimeChange(e.target.value)} error={timeError} />
    </div>
  );
}
