/* src/validators/authSchema.js */
const { z } = require('zod');
const { email, passwordBase, firstname, lastname } = require('./commonSchema');

//inviteSchema 
const inviteSchema = z.object({
    email,
    role: z.enum(['Admin', 'Selector', 'Super-admin'], {
        errorMap: () => ({ message: 'invalid role' })
    })
});

// passwordSchema 
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