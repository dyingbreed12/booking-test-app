import { NextResponse } from 'next/server';
import { CONTACT_EMAIL, isDemoLocked } from '@/lib/appLock';
import { prisma } from '@/lib/prisma';
import { customerLookupSchema, customerCreateSchema, normalizePhoneNumber } from '@/schemas/customer';

function lockedResponse() {
  return NextResponse.json(
    { error: `This demo is currently unavailable. Please contact ${CONTACT_EMAIL}.` },
    { status: 423 }
  );
}

/**
 * Customer lookup endpoint.
 *
 * This route is intentionally lightweight: it validates requests, normalizes
 * phone numbers, and returns a canonical customer record or null.
 */
export async function GET(request: Request) {
  if (isDemoLocked()) {
    return lockedResponse();
  }

  const url = new URL(request.url);
  const rawPhone = url.searchParams.get('phone') ?? '';
  const phone = normalizePhoneNumber(rawPhone);
  const parseResult = customerLookupSchema.safeParse({ phone });

  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid phone number', issues: parseResult.error.issues },
      { status: 400 }
    );
  }

  const customer = await prisma.customer.findUnique({
    where: { phoneNumber: phone }
  });

  return NextResponse.json({ customer: customer ?? null });
}

/**
 * Customer create/update endpoint.
 *
 * Uses upsert semantics so the client can safely retry the same contact
 * details without creating duplicate customer records.
 */
export async function POST(request: Request) {
  if (isDemoLocked()) {
    return lockedResponse();
  }

  const body = await request.json();
  const parseResult = customerCreateSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid customer data', issues: parseResult.error.issues },
      { status: 400 }
    );
  }

  const customer = await prisma.customer.upsert({
    where: { phoneNumber: normalizePhoneNumber(parseResult.data.phoneNumber) },
    update: {
      firstName: parseResult.data.firstName,
      lastName: parseResult.data.lastName,
      email: parseResult.data.email
    },
    create: {
      firstName: parseResult.data.firstName,
      lastName: parseResult.data.lastName,
      email: parseResult.data.email,
      phoneNumber: normalizePhoneNumber(parseResult.data.phoneNumber)
    }
  });

  return NextResponse.json({ customer });
}
