import { CustomerCreatePayload, customerLookupSchema, normalizePhoneNumber } from '@/schemas/customer';

/**
 * Lookup endpoint wrapper for customer data.
 *
 * The customer phone is normalized before validation so the rest of the code
 * can depend on a consistent international format.
 */
export async function lookupCustomer(phone: string) {
  const normalizedPhone = normalizePhoneNumber(phone);
  const parseResult = customerLookupSchema.safeParse({ phone: normalizedPhone });

  if (!parseResult.success) {
    throw new Error('Invalid phone number');
  }

  const response = await fetch(`/api/customer?phone=${encodeURIComponent(normalizedPhone)}`);

  if (!response.ok) {
    throw new Error('Unable to load customer record');
  }

  return response.json();
}

/**
 * Creates or updates a customer record before booking.
 *
 * This helper uses the same normalization behavior as the server route so
 * the persistence contract remains stable across client/server boundaries.
 */
export async function upsertCustomer(payload: CustomerCreatePayload) {
  const response = await fetch('/api/customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      phoneNumber: normalizePhoneNumber(payload.phoneNumber)
    })
  });

  if (!response.ok) {
    throw new Error('Unable to save customer record');
  }

  return response.json();
}
