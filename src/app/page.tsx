import BookingForm from '@/components/booking/BookingForm';

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-[32px] bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Let&apos;s get you on your way!
          </h1>
        </div>
        <BookingForm />
      </div>
    </main>
  );
}
