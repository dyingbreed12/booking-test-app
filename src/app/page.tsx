import BookingForm from '@/components/booking/BookingForm';
import { CONTACT_EMAIL, isDemoLocked } from '@/lib/appLock';

export const dynamic = 'force-dynamic';

function LockedDemoNotice() {
  return (
    <section className="rounded-[6px] border border-[#e5e5e5] bg-[#fffaf0] px-4 py-5 text-center shadow-sm">
      <p className="text-[15px] font-bold text-[#15172f]">This demo is currently unavailable.</p>
      <p className="mt-2 text-[14px] leading-6 text-[#52526a]">
        If you would still like to reach out, contact me at{' '}
        <a className="font-semibold text-[#6268c2] underline-offset-2 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </section>
  );
}

export default function HomePage() {
  const demoLocked = isDemoLocked();

  return (
    <main className="min-h-screen bg-white px-4 py-3 text-[#1f2340] sm:px-6">
      <div className="mx-auto w-full max-w-[517px]">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center text-[19px] font-bold text-[#6268c2]">
            Demo for Kyle
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h1 className="text-[22px] font-normal leading-tight tracking-[0] text-[#15172f]">
              {demoLocked ? 'Thanks for stopping by.' : "Let's get you on your way!"}
            </h1>
          </div>
          {demoLocked ? <LockedDemoNotice /> : <BookingForm />}
        </div>
      </div>
    </main>
  );
}
