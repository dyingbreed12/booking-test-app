'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { bookingSchema, type BookingFormValues } from '@/schemas/booking';
import { safeZodResolver } from '@/lib/resolvers/safeZodResolver';
import { lookupCustomer } from '@/lib/api/customer';
import { createBooking, type CreateBookingPayload } from '@/lib/api/booking';
import { ValidationError } from '@/lib/api/error';
import { useDistanceMatrix } from '@/lib/googleMaps';
import AddressAutocomplete from './AddressAutocomplete';
import DateTimeSection from './DateTimeSection';
import DistanceCard from './DistanceCard';
import PassengerInput from './PassengerInput';
import CustomerLookup from './CustomerLookup';
import BookingSummary from './BookingSummary';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';

// Default values are deliberately explicit so the booking form remains controlled
// even when parts of the form conditionally render based on customer lookup state.
const defaultValues: BookingFormValues = {
  bookingType: 'one-way',
  pickupDate: '',
  pickupTime: '',
  pickupLocationType: 'location',
  pickupAddress: '',
  pickupPlaceId: '',
  stops: [],
  dropoffLocationType: 'location',
  destinationAddress: '',
  destinationPlaceId: '',
  phoneNumber: '',
  isExistingCustomer: false,
  firstName: '',
  lastName: '',
  email: '',
  passengers: 1,
  notes: ''
};

// This flag is intentionally kept separate from the form state so we can
// easily enable notes as a future enhancement without altering the schema.
const SHOW_NOTES_FIELD = false;

function OneWayIcon() {
  return (
    <svg aria-hidden="true" className="h-[16px] w-[16px]" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.95" />
      <path d="M5 8h5.3M8.5 5.9 10.7 8l-2.2 2.1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HourlyIcon() {
  return (
    <svg aria-hidden="true" className="h-[16px] w-[16px]" viewBox="0 0 16 16" fill="none">
      <path d="M5 2.5h6M5 13.5h6M5.8 2.5v2.1c0 .7.3 1.4.9 1.8L8 7.5l1.3-1.1c.6-.4.9-1.1.9-1.8V2.5M5.8 13.5v-2.1c0-.7.3-1.4.9-1.8L8 8.5l1.3 1.1c.6.4.9 1.1.9 1.8v2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BookingForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    setError,
    formState: { errors }
  } = useForm<BookingFormValues>({
    defaultValues,
    resolver: safeZodResolver(bookingSchema) as any,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  });

  // Registering form fields manually ensures react-hook-form tracks fields
  // that are wired through controlled components or callbacks rather than direct refs.
  useEffect(() => {
    register('bookingType');
    register('pickupDate');
    register('pickupTime');
    register('pickupLocationType');
    register('pickupAddress');
    register('pickupPlaceId');
    register('dropoffLocationType');
    register('destinationAddress');
    register('destinationPlaceId');
    register('phoneNumber');
    register('isExistingCustomer');
    register('passengers');
    register('notes');
  }, [register]);

  const { fields, append, remove } = useFieldArray({ control, name: 'stops' });
  const [customerMessage, setCustomerMessage] = useState(
    "We don't have that phone number on file. Please provide additional contact information."
  );
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerFound, setCustomerFound] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<BookingFormValues | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const watchBookingType = watch('bookingType');
  const watchPhoneNumber = watch('phoneNumber');
  const watchPickupAddress = watch('pickupAddress');
  const watchPickupPlaceId = watch('pickupPlaceId');
  const watchDestinationAddress = watch('destinationAddress');
  const watchDestinationPlaceId = watch('destinationPlaceId');
  const watchPassengers = watch('passengers');
  const watchNotes = watch('notes');

  const { distanceText, durationText, error: distanceError, loading: distanceLoading } = useDistanceMatrix(
    watchPickupPlaceId,
    watchDestinationPlaceId
  );

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const tabButtonClass = (isActive: boolean) =>
    `relative inline-flex h-full min-w-0 items-center justify-center gap-2 border border-transparent px-3 text-[14px] font-normal transition ${
      isActive ? 'bg-[#fffaf0] text-[#c59d2f] shadow-[inset_0_0_0_1.5px_#d3b44d]' : 'bg-white text-[#6f707a]'
    }`;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleFormError = (errors: any) => {
    const firstError = errors && Object.values(errors)[0];
    const errorMessage = firstError?.message
      ? firstError.message
      : 'Please fill out all required fields before continuing.';

    setSubmissionStatus('error');
    setSubmissionMessage(errorMessage);
    showToast(errorMessage, 'error');
  };

  const handleCustomerLookup = async () => {
    if (!watchPhoneNumber) return;

    setCustomerLoading(true);
    setCustomerMessage('Looking up customer details...');

    try {
      const data = await lookupCustomer(watchPhoneNumber);

      if (data.customer) {
        setCustomerFound(true);
        setCustomerMessage(`Welcome back, ${data.customer.firstName}`);
        setValue('isExistingCustomer', true);
        setValue('firstName', data.customer.firstName);
        setValue('lastName', data.customer.lastName);
        setValue('email', data.customer.email);
      } else {
        setCustomerFound(false);
        setCustomerMessage("We don't have that phone number on file. Please provide additional contact information.");
        setValue('isExistingCustomer', false);
      }
    } catch {
      setCustomerFound(false);
      setCustomerMessage('Unable to verify phone number right now. Please continue with contact details.');
      setValue('isExistingCustomer', false);
    } finally {
      setCustomerLoading(false);
    }
  };

  const addStop = () => {
    if (fields.length >= 3) return;
    append({ address: '', placeId: '' });
  };

  const onSubmit = async (data: BookingFormValues) => {
    setSubmissionStatus('submitting');
    setSubmissionMessage(null);
    setBookingReference(null);

    try {
      const payload: CreateBookingPayload = {
        ...data,
        stops: data.stops,
        distanceText,
        durationText
      };

      const bookingResponse = await createBooking(payload);

      // Mock booking call - continue even if it fails
      let mockData: { bookingReference?: string } | null = null;
      try {
        const mockResponse = await fetch('/api/mock-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (mockResponse.ok) {
          mockData = await mockResponse.json().catch(() => null);
        }
      } catch {
        // Silently continue without mock data, use main booking reference instead
      }

      const bookingRef = mockData?.bookingReference ?? bookingResponse.bookingReference ?? null;
      setBookingReference(bookingRef);
      setSummaryData(data);
      setSubmissionStatus('success');
      setSubmissionMessage('Booking confirmed successfully.');
      showToast('Booking confirmed successfully.', 'success');
    } catch (error) {
      if (error instanceof ValidationError) {
        // Apply field-level errors from the API validation
        Object.entries(error.fieldErrors).forEach(([fieldName, errorMessage]) => {
          setError(fieldName as any, {
            type: 'manual',
            message: errorMessage
          });
        });

        const firstError = Object.values(error.fieldErrors)[0];
        setSubmissionStatus('error');
        setSubmissionMessage(firstError || 'Please fix validation errors and try again.');
        showToast(firstError || 'Please fix validation errors and try again.', 'error');
      } else {
        const message = error instanceof Error ? error.message : 'Unable to submit booking. Please try again later.';
        setSubmissionStatus('error');
        setSubmissionMessage(message);
        showToast(message, 'error');
      }
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit as any, handleFormError);

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </div>
      ) : null}
      <form onSubmit={handleFormSubmit} className="space-y-5">
        <section className="space-y-5">
          <fieldset className="space-y-3">
            <legend className="sr-only">Booking type</legend>
            <div className="grid h-[30px] grid-cols-2 overflow-hidden rounded-[6px] border border-[#e5e5e5] bg-white text-[14px]">
              {['one-way', 'hourly'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setValue('bookingType', option as BookingFormValues['bookingType'])}
                  className={`${tabButtonClass(watchBookingType === option)} ${option === 'one-way' ? 'rounded-l-[5px]' : 'rounded-r-[5px]'}`}
                >
                  <span
                    className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[11px] ${
                      watchBookingType === option ? 'text-[#d3b44d]' : 'text-[#747474]'
                    }`}
                  >
                    {option === 'one-way' ? <OneWayIcon /> : <HourlyIcon />}
                  </span>
                  {option === 'one-way' ? 'One-way' : 'Hourly'}
                </button>
              ))}
            </div>
            {watchBookingType === 'hourly' ? (
              <p className="text-[13px] text-[#52526a]">Hourly bookings coming soon.</p>
            ) : null}
          </fieldset>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold text-[#15172f]">Pickup</p>
            </div>
            <DateTimeSection
              date={watch('pickupDate')}
              time={watch('pickupTime')}
              onDateChange={(value) => setValue('pickupDate', value, { shouldDirty: true })}
              onTimeChange={(value) => setValue('pickupTime', value, { shouldDirty: true })}
              dateError={errors.pickupDate?.message?.toString()}
              timeError={errors.pickupTime?.message?.toString()}
            />
            <div className="inline-grid h-[30px] grid-cols-2 overflow-hidden rounded-[6px] border border-[#e5e5e5] bg-white text-[14px]">
              {['location', 'airport'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setValue('pickupLocationType', option as BookingFormValues['pickupLocationType'])}
                  className={`${tabButtonClass(watch('pickupLocationType') === option)} ${option === 'location' ? 'rounded-l-[5px]' : 'rounded-r-[5px]'}`}
                >
                  {option === 'location' ? 'Location' : 'Airport'}
                </button>
              ))}
            </div>
            <AddressAutocomplete
              label="Location"
              value={watchPickupAddress}
              placeholder="Clintons Bar & Grille, High Street, Clinton, MA, USA"
              onChange={(value) => setValue('pickupAddress', value)}
              onSelect={(address, placeId) => {
                setValue('pickupAddress', address);
                setValue('pickupPlaceId', placeId);
              }}
              error={errors.pickupAddress?.message?.toString()}
            />
            {fields.length < 3 ? (
              <button
                type="button"
                onClick={addStop}
                className="pl-2 text-[13px] font-normal text-[#c99f31]"
              >
                + Add a stop
              </button>
            ) : null}
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-3 rounded-[4px] border border-[#cfd1d8] bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[14px] font-semibold text-[#15172f]">Stop {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-[13px] text-[#74758a] transition hover:text-[#15172f]"
                    >
                      Remove
                    </button>
                  </div>
                  <AddressAutocomplete
                    label="Address"
                    value={watch(`stops.${index}.address`) as string}
                    placeholder="Search stop address"
                    onChange={(value) => setValue(`stops.${index}.address`, value)}
                    onSelect={(address, placeId) => {
                      setValue(`stops.${index}.address`, address);
                      setValue(`stops.${index}.placeId`, placeId);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <p className="text-[15px] font-bold text-[#15172f]">Drop off</p>
            <div className="inline-grid h-[30px] grid-cols-2 overflow-hidden rounded-[6px] border border-[#e5e5e5] bg-white text-[14px]">
              {['location', 'airport'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setValue('dropoffLocationType', option as BookingFormValues['dropoffLocationType'])}
                  className={`${tabButtonClass(watch('dropoffLocationType') === option)} ${option === 'location' ? 'rounded-l-[5px]' : 'rounded-r-[5px]'}`}
                >
                  {option === 'location' ? 'Location' : 'Airport'}
                </button>
              ))}
            </div>
            <AddressAutocomplete
              label="Location"
              value={watchDestinationAddress}
              placeholder="Logan Airport Terminal B, Boston, MA, USA"
              onChange={(value) => setValue('destinationAddress', value)}
              onSelect={(address, placeId) => {
                setValue('destinationAddress', address);
                setValue('destinationPlaceId', placeId);
              }}
              error={errors.destinationAddress?.message?.toString()}
            />
          </div>

          <DistanceCard distance={distanceText} duration={durationText} error={distanceError} loading={distanceLoading} />
        </section>

        <section className="space-y-3">
          <div>
            <p className="text-[15px] font-bold text-[#15172f]">Contact Information</p>
          </div>
          <CustomerLookup
            label="Phone Number"
            value={watchPhoneNumber}
            onChange={(value) => setValue('phoneNumber', value)}
            onBlur={handleCustomerLookup}
            loading={customerLoading}
            message={customerMessage}
            error={errors.phoneNumber?.message?.toString()}
          >
            {!customerFound ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First name"
                  type="text"
                  placeholder="First name"
                  {...register('firstName')}
                  error={errors.firstName?.message?.toString()}
                />
                <Input
                  label="Last name"
                  type="text"
                  placeholder="Last name"
                  {...register('lastName')}
                  error={errors.lastName?.message?.toString()}
                />
              </div>
            ) : null}
            {!customerFound ? (
              <Input
                label="Email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                error={errors.email?.message?.toString()}
              />
            ) : null}
          </CustomerLookup>

          <PassengerInput
            value={watchPassengers}
            onChange={(value) => setValue('passengers', value)}
            error={errors.passengers?.message?.toString()}
          />

          {SHOW_NOTES_FIELD ? (
            <div>
              <label className="mb-2 block text-[13px] font-normal text-[#15172f]">Notes (optional)</label>
              <textarea
                rows={4}
                className="w-full rounded-[4px] border border-[#cfd1d8] bg-white px-3 py-2 text-[14px] text-[#272a42] outline-none transition placeholder:text-[#aeb0b8] focus:border-[#d3b44d] focus:ring-1 focus:ring-[#d3b44d]/30"
                placeholder="Add any special instructions or details"
                value={watchNotes}
                onChange={(event) => setValue('notes', event.target.value)}
              />
            </div>
          ) : null}
        </section>

        <div>
          <Button type="submit" className="w-full" disabled={submissionStatus === 'submitting'}>
            {submissionStatus === 'submitting' ? 'Submitting...' : 'Continue'}
          </Button>
          {submissionMessage ? (
            <p className={`mt-3 text-sm ${submissionStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {submissionMessage}
            </p>
          ) : null}
        </div>
      </form>

      {summaryData ? (
        <BookingSummary
          firstName={summaryData.firstName ?? 'N/A'}
          lastName={summaryData.lastName ?? ''}
          phoneNumber={summaryData.phoneNumber}
          pickupAddress={summaryData.pickupAddress}
          stops={summaryData.stops.map((stop) => ({ address: stop.address }))}
          destinationAddress={summaryData.destinationAddress}
          distanceText={distanceText}
          durationText={durationText}
          pickupDate={summaryData.pickupDate}
          pickupTime={summaryData.pickupTime}
          passengers={summaryData.passengers}
          notes={summaryData.notes}
          reference={bookingReference ?? undefined}
        />
      ) : null}
    </div>
  );
}
