import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  address: z.any().optional()
});
