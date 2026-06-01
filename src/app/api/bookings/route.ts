import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();

  const {
    bookingType,
    pickupAddress,
    pickupPlaceId,
    destinationAddress,
    destinationPlaceId,
    stops,
    phoneNumber,
    firstName,
    lastName,
    email,
    passengers,
    pickupDate,
    pickupTime,
    notes,
    distanceText,
    durationText
  } = body;

  if (!phoneNumber || !pickupAddress || !destinationAddress || !pickupDate || !pickupTime) {
    return NextResponse.json({ error: 'Missing booking information' }, { status: 400 });
  }

  const customer = await prisma.customer.upsert({
    where: { phoneNumber },
    update: {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: email || undefined
    },
    create: {
      firstName: firstName || 'Guest',
      lastName: lastName || 'Customer',
      email: email || 'unknown@example.com',
      phoneNumber
    }
  });

  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      pickupAddress,
      pickupPlaceId,
      destinationAddress,
      destinationPlaceId,
      stops,
      distanceText: distanceText || null,
      durationText: durationText || null,
      bookingDate: new Date(pickupDate),
      bookingTime: pickupTime,
      passengers: Number(passengers),
      notes: notes || null
    }
  });

  return NextResponse.json({ booking });
}
