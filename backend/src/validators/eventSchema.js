const { z } = require('zod');
const { date, imageSchema, nameSchema } = require('./commonSchema');

const eventSchema = z.object({
  title: nameSchema,
  date,
  description: z.string().trim().max(2000).optional(),
  duration: z.coerce.number().int().min(0).optional(),
  capacity: z.coerce.number().int().min(0).optional(),
  illustration: imageSchema.optional(),
  location: z.string().trim().max(255).optional(),
  id_USER: z.coerce.number().int().positive().optional(),
});

module.exports = { eventSchema };