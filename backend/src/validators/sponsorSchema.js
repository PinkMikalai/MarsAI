const { z } = require('zod');

// import du commonSchema
const { url, imageSchema, nameSchema } = require('./commonSchema');

const sponsorSchema = z.object({
    img: imageSchema.optional(),
    name: nameSchema,
    url: url.optional(),
});

module.exports = { sponsorSchema };