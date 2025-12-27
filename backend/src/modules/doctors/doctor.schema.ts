import { z } from 'zod';

export const DoctorOnboardSchema = z.object({
  speciality: z.string(),
  degree: z.string(),
  experience: z.number(),
  fees: z.number()
});
