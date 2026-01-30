const { z } = require('zod'); 

// extraction de ce dont on a besoin de commonSchema
const { email, firstname, lastname, id, date, url } = require('./commonSchema');


// validation des entrées du tableau des contributeurs 
const contributorSchema = z.object({
    firstname: firstname,
    last_name: lastname,
    email: email,
    gender: z.enum(["Mr", "Mrs", "Other"], {errorMap: () => ({ message: "Gender must be Mr, Mrs, or Other" })
  }), 
    production_role: z
        .string({
            required_error: "Production role is required",
            invalid_type_error: "Production role must be a string"
        })
        .trim()
        .min(1, "Production role cannot be empty")
}); 

// validation des entrées du tableau des tags
const tagSchema = z.object({
    name: z
        .string({required_error: "Tag name is required"})
        .trim()
        .min(1, "Tag name cannot be empty")
}); 

// validation des entrées du tableau des stills
const stillSchema = z.object({
    file_name: z
        .string()
        .trim()
        .min(1, "File name cannot be empty")
});

// validation de toutes les entrées du formulaire 
const participationSchema = z.object({
    // identité de la vidéo 

    // TITLE original et anglais 
    title: z
        .string()
        .trim()
        .max(100, "Title is too long (maximum 100 characters)")
        .optional()
        .or(z.literal("")), //optional autorise le champs à être absent du json, literal autorise le champ à être une chaîne vide

    title_en: z
        .string({ required_error: "Title is required" })
        .trim()
        .min(1, "Title cannot be empty")
        .max(100, "English title is too long (max 100 chars)"),

    // SYNOPSIS original et anglais : Limite 500 caractères 
    synopsis: z
        .string()
        .trim()
        .max(300, "Synopsis is too long (max 300 chars)")
        .optional()
        .or(z.literal("")),

    synopsis_en: z.string({ required_error: "English synopsis is required" })
        .trim()
        .min(1, "English synopsis cannot be empty")
        .max(300, "English synopsis is too long (max 300 chars)"),

    // RESUMES (SUMMARY) - Limite 500 caractères
    tech_resume: z
        .string({ required_error: "Technical summary is required" })
        .trim()
        .min(1, "Technical summary cannot be empty")
        .max(500, "Technical summary is too long (max 500 chars)"),

    creative_resume: z
        .string({ required_error: "Creative summary is required" })
        .trim()
        .min(1, "Creative summary cannot be empty")
        .max(500, "Creative summary is too long (max 500 chars)"),
    
    // DETAILS TECHNIQUES 

    duration: z.coerce
        .number()
        .int()
        .positive()
        .max(120, "Duration cannot exceed 120 seconds"),
    
    // LANGUE : ISO 639-1 (Exactement 2 caractères, ex: "fr")
    language: z
        .string({ required_error: "Language is required" })
        .trim()
        .length(2, "Please use a 2-letter language code (e.g., 'en', 'fr')")
        .transform(val => val.toUpperCase()),

    // PAYS (Standard ISO 3166-1 alpha-2)
    country: z
        .string({ required_error: "Country is required" })
        .trim()
        .length(2, "Please use a 2-letter country code (e.g., 'FR', 'US')")
        .transform(val => val.toUpperCase()),

    classification: z
        .enum(["100% AI", "Hybrid"], {errorMap: () => ({ message: "Please select a valid classification: '100% AI' or 'Hybrid'" })
        }),

    // REALISATEUR
    realisator_firstname: firstname,
    realisator_lastname: lastname,
    realisator_civility: z
        .string()
        .enum(["Mr", "Mrs", "Other"], {errorMap: () => ({ message: "Civility must be Mr, Mrs, or Other" })
    }),


    // CONTACT
    email: email, 
    birthdate: z
        .string({ required_error: "Birthdate is required" })
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD (e.g., 1990-05-15)"),
    // TÉLÉPHONE : Format E.164 (ex: +33612345678)
    mobile_number: z
        .string({ required_error: "Mobile number is required" })
        .trim()
        .regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number starting with '+' and your country code (e.g., +33612345678)"),
    // ADDRESSE 
    address: z
        .string({ required_error: "Address is required" })
        .trim()
        .min(5, "Please enter a complete address (minimum 5 characters)"),
    
    social_media_links_json: z
        .string({ required_error: "Social media links are required" })
        .min(1, "Social media links cannot be empty")
        // refine permet de créer une règle de validation sur mesure 
        .refine((val) => {
            try {
                // on tente de transformer la chaîne de caractères en objet JS réel
                const parsed = JSON.parse(val);
                // On vérifie que c'est bien un objet et pas juste un chiffre ou un booléen
                return typeof parsed === 'object' && parsed !== null;
            } catch (e) {
                return false;
            }
        }, "Social media links must be a valid JSON object"),

})



module.exports = participationSchema; 



