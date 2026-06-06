import { BookingFormValues } from '@/schemas/booking';

export type CreateBookingPayload = Omit<BookingFormValues, 'distanceText' | 'durationText'> & {
  distanceText?: string | null;
  durationText?: string | null;
};

export async function createBooking(payload: CreateBookingPayload) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error ?? 'Unable to create booking';
    throw new Error(message);
  }

  return response.json();
}
