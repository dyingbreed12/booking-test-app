import { z } from 'zod';

export const customerLookupSchema = z.object({
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\+?[0-9]{10,15}$/, 'Enter a valid international phone number')
});

export const normalizePhoneNumber = (phone: string) => phone.replace(/[^+0-9]/g, '');

export const customerCreateSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  email: z.string().email('Enter a valid email'),
  phoneNumber: z.preprocess(
    (value) => (typeof value === 'string' ? normalizePhoneNumber(value) : value),
    z.string().min(10).max(15).regex(/^\+?[0-9]{10,15}$/, 'Enter a valid international phone number')
  )
});

export type CustomerCreatePayload = z.infer<typeof customerCreateSchema>;
