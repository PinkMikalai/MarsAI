const {z}= require ( 'zod')
const {email } = require ('./commonSchema')


const loginSchema = 
z.object({
  email: email,
  password: z.string().min(1, "Password is required")
});

module.exports = loginSchema;