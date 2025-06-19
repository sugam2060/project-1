import { z } from 'zod';

export const addressSchema = z.object({
  locationId: z.string().min(1, 'Location is required'),
  addressLine: z.string().min(1, 'Address line is required'),
  postalCode: z.string().optional(),
  phone: z.string()
    .length(10, 'Phone number must be a 10-digit number.')
    .regex(/^\d{10}$/, 'Phone number must be a 10-digit number.'),
}); 