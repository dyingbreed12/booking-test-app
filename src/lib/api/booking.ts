import { BookingFormValues } from '@/schemas/booking';
import { ValidationError, zodIssuesToFieldErrors } from './error';

export type CreateBookingPayload = Omit<BookingFormValues, 'distanceText' | 'durationText'> & {
  distanceText?: string | null;
  durationText?: string | null;
};

/**
 * Centralized booking API wrapper for the frontend.
 *
 * If the server route changes, update this helper first so the calling
 * components remain unchanged.
 *
 * Throws ValidationError for 400 responses with field-level validation issues,
 * or a generic Error for other failures.
 */
export async function createBooking(payload: CreateBookingPayload) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    // Handle validation errors with field-level details
    if (response.status === 400 && body?.issues) {
      const fieldErrors = zodIssuesToFieldErrors(body.issues);
      throw new ValidationError(fieldErrors);
    }

    const message = body?.error ?? 'Unable to create booking';
    throw new Error(message);
  }

  return response.json();
}
