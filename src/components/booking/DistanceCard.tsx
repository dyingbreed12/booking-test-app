'use client';

interface DistanceCardProps {
  distance?: string | null;
  duration?: string | null;
  error?: string | null;
  loading?: boolean;
}

/**
 * Displays the current distance calculation state.
 *
 * This component layers loading, error, and result states in a predictable way
 * so the parent form does not need to manage those presentation details.
 */
export default function DistanceCard({ distance, duration, error, loading }: DistanceCardProps) {
  return (
    <div className="rounded-[4px] border border-[#cfd1d8] bg-white px-4 py-3">
      <h2 className="mb-3 text-[14px] font-semibold text-[#15172f]">Distance</h2>
      {loading ? (
        <p className="text-[13px] text-[#52526a]">Calculating distance...</p>
      ) : error ? (
        <p className="text-[13px] text-red-600">{error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[4px] border border-[#e1e2e6] bg-[#fbfbfa] p-3 text-[13px] text-[#272a42]">
            <p className="text-[11px] text-[#74758a]">Distance</p>
            <p className="mt-1 text-[16px] font-semibold">{distance ?? '-'}</p>
          </div>
          <div className="rounded-[4px] border border-[#e1e2e6] bg-[#fbfbfa] p-3 text-[13px] text-[#272a42]">
            <p className="text-[11px] text-[#74758a]">Travel Time</p>
            <p className="mt-1 text-[16px] font-semibold">{duration ?? '-'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
