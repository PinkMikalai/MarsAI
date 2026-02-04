const { z } = require('zod'); 


// import des autres schemas
const { firstname, lastname, imageSchema, bioSchema } = require('./commonSchema');



const jurySchema = z.object({
    firstname: firstname,
    lastname: lastname,
    illustration: imageSchema.optional(),
    bio: bioSchema.optional(),
});

module.exports = { jurySchema };