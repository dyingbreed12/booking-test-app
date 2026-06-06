import { z } from 'zod';

export const bookingSchema = z
  .object({
    bookingType: z.enum(['one-way', 'hourly']),
    pickupDate: z.string().min(1, 'Pickup date is required'),
    pickupTime: z.string().min(1, 'Pickup time is required'),
    pickupLocationType: z.enum(['location', 'airport']),
    pickupAddress: z.string().min(1, 'Pickup address is required'),
    pickupPlaceId: z.string().min(1, 'Pickup place id is required'),
    stops: z.array(
      z.object({
        address: z.string().min(1, 'Stop address is required'),
        placeId: z.string().min(1, 'Stop place id is required')
      })
    ),
    dropoffLocationType: z.enum(['location', 'airport']),
    destinationAddress: z.string().min(1, 'Destination address is required'),
    destinationPlaceId: z.string().min(1, 'Destination place id is required'),
    phoneNumber: z
      .string()
      .min(10, 'Phone number must be 10 to 15 digits')
      .max(15, 'Phone number must be 10 to 15 digits')
      .regex(/^\+?[0-9]{10,15}$/, 'Enter a valid international phone number'),
    isExistingCustomer: z.boolean().optional(),
    firstName: z.string().min(2, 'First name must be 2-50 characters').max(50).optional(),
    lastName: z.string().min(2, 'Last name must be 2-50 characters').max(50).optional(),
    email: z.string().email('Enter a valid email').optional(),
    passengers: z
      .number()
      .min(1, 'Minimum 1 passenger')
      .max(20, 'Maximum 20 passengers'),
    notes: z.string().optional(),
    distanceText: z.string().optional(),
    durationText: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (!data.isExistingCustomer) {
      if (!data.firstName) {
        ctx.addIssue({ code: 'custom', path: ['firstName'], message: 'First name is required' });
      }
      if (!data.lastName) {
        ctx.addIssue({ code: 'custom', path: ['lastName'], message: 'Last name is required' });
      }
      if (!data.email) {
        ctx.addIssue({ code: 'custom', path: ['email'], message: 'Email is required' });
      }
    }

    const selectedDate = new Date(data.pickupDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      ctx.addIssue({ code: 'custom', path: ['pickupDate'], message: 'Date cannot be in the past' });
    }
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;
