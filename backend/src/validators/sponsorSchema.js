import { z } from 'zod';
import { url, imageSchema, nameSchema } from './commonSchema.js';

const sponsorSchema = z.object({
    img: imageSchema.optional(),
    name: nameSchema,
    url: url.optional(),
});

export { sponsorSchema };
