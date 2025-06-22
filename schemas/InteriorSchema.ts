import { z } from 'zod';

export const InteriorSchema = z.object({
  images: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size > 0, {
          message: 'Empty file is not allowed.',
        })
        .refine((file) => file.type.startsWith('image/'), {
          message: 'Only image files are allowed.',
        })
    )
    .max(6, { message: 'You can upload up to 6 images at a time.' }),
});
