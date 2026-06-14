import { NextResponse } from 'next/server';
import { CONTACT_EMAIL, isDemoLocked } from '@/lib/appLock';

export async function POST() {
  if (isDemoLocked()) {
    return NextResponse.json(
      { error: `This demo is currently unavailable. Please contact ${CONTACT_EMAIL}.` },
      { status: 423 }
    );
  }

  const reference = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
  return NextResponse.json({ success: true, bookingReference: reference });
}
