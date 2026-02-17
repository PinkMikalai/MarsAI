import { z } from 'zod';
import { firstname, lastname, imageSchema, bioSchema } from './commonSchema.js';

const jurySchema = z.object({
    firstname: firstname,
    lastname: lastname,
    illustration: imageSchema.optional(),
    bio: bioSchema.optional(),
});

export { jurySchema };
