const { z } = require('zod');

// import du commonSchema
const { url, imageSchema, nameSchema } = require('./commonSchema');

const sponsorSchema = z.object({
    name: nameSchema,
    img: imageSchema,
    url: url.optional(),
});

module.exports = { sponsorSchema };