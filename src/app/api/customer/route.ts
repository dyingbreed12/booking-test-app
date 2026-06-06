import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { customerLookupSchema, customerCreateSchema, normalizePhoneNumber } from '@/schemas/customer';

export async function GET(request: Request) {
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

export async function POST(request: Request) {
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
