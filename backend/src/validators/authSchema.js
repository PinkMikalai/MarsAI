/* src/validators/authSchema.js */
const { z } = require('zod');
const { email, passwordBase, firstname, lastname } = require('./commonSchema');

// 1. inviteSchema doit être plat
const inviteSchema = z.object({
    email,
    firstname,
    lastname,
    role: z.enum(['Admin', 'Selector', 'Super-admin'], {
        errorMap: () => ({ message: 'invalid role' })
    })
});

// 2. passwordSchema doit être plat aussi
const passwordSchema = z.object({
    token: z.string().min(1),
    firstname: firstname, 
    lastname: lastname,
    password: passwordBase,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

module.exports = { inviteSchema, passwordSchema };