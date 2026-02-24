import { z } from 'zod';

const updateCmsSchema = z.object({
  english_content: z.string().trim().max(10000).optional(),
  french_content: z.string().trim().max(10000).optional(),
  illustration: z.string().trim().max(255).optional().nullable(),
});

export { updateCmsSchema };
