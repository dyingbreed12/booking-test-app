import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const phone = url.searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }
  console.log(`Looking up customer with phone: ${phone}`);
  const customer = await prisma.customer.findUnique({
    where: { phoneNumber: phone }
  });

  return NextResponse.json({ customer: customer ?? null });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, email, phoneNumber } = body;

  if (!firstName || !lastName || !email || !phoneNumber) {
    return NextResponse.json({ error: 'Missing customer data' }, { status: 400 });
  }

  const customer = await prisma.customer.upsert({
    where: { phoneNumber },
    update: { firstName, lastName, email },
    create: { firstName, lastName, email, phoneNumber }
  });

  return NextResponse.json({ customer });
}
