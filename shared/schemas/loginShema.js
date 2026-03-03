import { z } from 'zod';
import { email } from './commonSchema.js';

const loginSchema = z.object({
  email: email,
  password: z.string().min(1, "Password is required")
});

export default loginSchema;
