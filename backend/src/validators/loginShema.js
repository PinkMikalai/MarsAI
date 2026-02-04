const {z}= require ( 'zod')
const {email} = require ('./commonSchema')
const {password} = require ('./authSchema')

const loginSchema = 
z.object({
  email: email,
  password: password
});

module.exports = loginSchema;