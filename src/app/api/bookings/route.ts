import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bookingSchema } from '@/schemas/booking';
import { normalizePhoneNumber } from '@/schemas/customer';

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = bookingSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid booking payload', issues: parseResult.error.issues },
      { status: 400 }
    );
  }

  const bookingData = parseResult.data;
  const phoneNumber = normalizePhoneNumber(bookingData.phoneNumber);

  const customer = await prisma.customer.upsert({
    where: { phoneNumber },
    update: {
      firstName: bookingData.firstName || undefined,
      lastName: bookingData.lastName || undefined,
      email: bookingData.email || undefined
    },
    create: {
      firstName: bookingData.firstName || 'Guest',
      lastName: bookingData.lastName || 'Customer',
      email: bookingData.email || 'unknown@example.com',
      phoneNumber
    }
  });

  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      pickupAddress: bookingData.pickupAddress,
      pickupPlaceId: bookingData.pickupPlaceId,
      destinationAddress: bookingData.destinationAddress,
      destinationPlaceId: bookingData.destinationPlaceId,
      stops: bookingData.stops,
      distanceText: bookingData.distanceText ?? null,
      durationText: bookingData.durationText ?? null,
      bookingDate: new Date(bookingData.pickupDate),
      bookingTime: bookingData.pickupTime,
      passengers: bookingData.passengers,
      notes: bookingData.notes ?? null
    }
  });

  const bookingReference = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

  return NextResponse.json({ booking, bookingReference });
}
