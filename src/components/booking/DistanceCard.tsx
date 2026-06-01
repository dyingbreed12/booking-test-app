'use client';

interface DistanceCardProps {
  distance?: string | null;
  duration?: string | null;
  error?: string | null;
  loading?: boolean;
}

export default function DistanceCard({ distance, duration, error, loading }: DistanceCardProps) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">Distance</h2>
      {loading ? (
        <p className="text-sm text-slate-500">Calculating distance...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-4 text-sm text-slate-800 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Distance</p>
            <p className="mt-2 text-lg font-semibold">{distance ?? '—'}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 text-sm text-slate-800 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Travel Time</p>
            <p className="mt-2 text-lg font-semibold">{duration ?? '—'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
