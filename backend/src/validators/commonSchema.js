const { z } = require('zod');

const commonSchema = {
  // schéma de validation des email
  email: z
    .string({ required_error: "Email address is required" })
    .trim()
    .email({ message: "Invalid email format" })
    .lowercase(),

 // schéma de validation des ID
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a number")
    .transform(Number),

 // schéma de validation des dates
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)), // Transforme la string en objet Date JS

  // schéma de validation des urls
  url: z
    .string()
    .url({ message: "Invalid URL" })
    .trim(),
  
  // schéma de validation des prénoms
  firstname: z
    .string()
    .trim()
    .min(1, { message: "Firstname is mandatory" }),

  // schéma de validation des noms
  lastname: z
    .string()
    .trim()
    .min(1, { message: "Lastname is mandatory" }),
};

module.exports = commonSchema;
