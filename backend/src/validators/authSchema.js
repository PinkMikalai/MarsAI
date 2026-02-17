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
    token: z.string().min(1, "Token is required"),
    firstname: firstname, 
    lastname: lastname,
    password: passwordBase,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

// resetPasswordSchéma
const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: passwordBase,
    confirmNewPassword : z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"]
});

const updatePasswordSchema = z.object({
    oldPassword : passwordBase,
    newPassword: passwordBase,
    confirmNewPassword : z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"]
});


module.exports = { inviteSchema, passwordSchema, resetPasswordSchema, updatePasswordSchema};