'use client';

interface BookingSummaryProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pickupAddress: string;
  stops: Array<{ address: string }>;
  destinationAddress: string;
  distanceText?: string | null;
  durationText?: string | null;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  notes?: string;
  reference?: string;
}

/**
 * Booking confirmation summary shown after a successful submit.
 *
 * This component is intentionally presentational and only reflects the
 * completed booking state. Any future split between a summary review step and
 * confirmation step should still reuse this view.
 */
export default function BookingSummary({
  firstName,
  lastName,
  phoneNumber,
  pickupAddress,
  stops,
  destinationAddress,
  distanceText,
  durationText,
  pickupDate,
  pickupTime,
  passengers,
  notes,
  reference
}: BookingSummaryProps) {
  return (
    <section className="mt-8 rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">Booking summary</p>
        {reference ? <p className="mt-2 text-sm text-brand-gold">Reference: {reference}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Customer</p>
          <p className="mt-3 text-sm text-slate-900">{firstName} {lastName}</p>
          <p className="mt-1 text-sm text-slate-500">{phoneNumber}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Trip</p>
          <p className="mt-3 text-sm text-slate-900">{pickupDate} • {pickupTime}</p>
          <p className="mt-2 text-sm text-slate-500">Passengers: {passengers}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pickup</p>
          <p className="mt-3 text-sm text-slate-900">{pickupAddress}</p>
        </div>
        {stops.length > 0 ? (
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Stops</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-900">
              {stops.map((stop, index) => (
                <li key={index}>{stop.address}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Destination</p>
          <p className="mt-3 text-sm text-slate-900">{destinationAddress}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Distance</p>
          <p className="mt-3 text-base font-semibold text-slate-900">{distanceText ?? '—'}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Travel time</p>
          <p className="mt-3 text-base font-semibold text-slate-900">{durationText ?? '—'}</p>
        </div>
      </div>
      {notes ? (
        <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Notes</p>
          <p className="mt-3 text-sm text-slate-900">{notes}</p>
        </div>
      ) : null}
    </section>
  );
}
