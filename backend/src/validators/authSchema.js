const {z}= require ( 'zod')
const {email, firstname, lastname} = require ('./commonSchema')

const authSchema = {
    // validation des inscription au compte suite à l'invitation de l'admin
    inviteSchema: z.object({
    body: z.object({
      email,
      firstname,
      lastname
    })
  }),
// Génération du mot de passe
  PasswordSchema: z.object({
    body: z.object({
      token: z.string().min(1),
      password:z
    .string()
    .min(6, "")
    .regex(/[0-9]/, "At least one number is required"),
      confirmPassword: z.string()
    })
  }).refine((data) => data.body.password === data.body.confirmPassword, {
    message: "Passwords do not match",
    path: ["body", "confirmPassword"] // ciblage le champ dans le body
  }),


};

module.exports = authSchema