const { z } = require ('zod');

const inviteSchema = z.object( {
    email: z.string()
    .email("Invalid email format")
    .min(1, "email is mandatory"),
    role : z.enum (['admin', 'selector', 'super-admin'] , {
        errorMap: () => ({message :'invalid role'})

    })
})

module.exports = inviteSchema