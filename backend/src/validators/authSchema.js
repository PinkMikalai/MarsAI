const { z } = require('zod');
const { email, firstname, lastname } = require('./commonSchema');

//Shéma de l'invitation envoyée par le super-admin
const inviteSchema = z.object({
  body: z.object({
    email,
    firstname,
    lastname,
    role: z.enum(['Admin', 'Selector', 'Super_admin'], {
      errorMap: () => ({ message: 'invalid role' })
    })
  })
});

// Schéma du mot de passe
const passwordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z.string()
      .min(6, "Minimum 6 characters")
      .regex(/[0-9]/, "At least one number is required"),
    confirmPassword: z.string()
  })
}).refine((data) => data.body.password === data.body.confirmPassword, {
  message: "Passwords do not match",
  path: ["body", "confirmPassword"]
});

module.exports = { inviteSchema, passwordSchema };