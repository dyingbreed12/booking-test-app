import { NextResponse } from 'next/server';

export async function POST() {
  const reference = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
  return NextResponse.json({ success: true, bookingReference: reference });
}
