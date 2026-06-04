import BookingForm from '@/components/booking/BookingForm';

export default function HomePage() {
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
              Let&apos;s get you on your way!
            </h1>
          </div>
          <BookingForm />
        </div>
      </div>
    </main>
  );
}
