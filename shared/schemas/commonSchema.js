import { z } from 'zod';

const commonSchema = {
  // schéma de validation des email
  email: z
    .string({ required_error: "err_email_required" })
    .trim()
    .email({ message: "err_email_invalid" })
    .lowercase(),

  // shéma de validation des mot de passe en général (sans génération de token)
   passwordBase: z
   .string().min(6, "At least 6 characters")
   .regex(/[0-9]/, "At least one number is required"),

 // schéma de validation des ID
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a number")
    .transform(Number),

 // schéma de validation des dates
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)), // Transforme la string en objet Date JS

  // schéma de validation des urls
  url: z
    .string()
    .trim()
    .refine(
      (val) => {
        // Accepte soit un domaine simple (exemple.com) soit une URL complète avec http:// ou https://
        const simpleUrlPattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        const fullUrlPattern = /^https?:\/\/([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/;
        
        return simpleUrlPattern.test(val) || fullUrlPattern.test(val);
      },
      { message: "Invalid URL format. Use either 'example.com' or 'http://example.com' or 'https://example.com'" }
    ),
  
  // schéma de validation des prénoms
  firstname: z
    .string({ required_error: "err_firstname_required" })
    .trim()
    .min(1, { message: "err_firstname_empty" })
    .max(50, { message: "err_firstname_too_long" })
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, { message: "err_firstname_invalid" }),

  // schéma de validation des noms
  lastname: z
    .string({ required_error: "err_lastname_required" })
    .trim()
    .min(1, { message: "err_lastname_empty" })
    .max(50, { message: "err_lastname_too_long" })
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, { message: "err_lastname_invalid" }),
    ////////////////////
    //shemas de validation des noms et bio
    ////////////////////

    // shemas qui controllent les images jurys et sponsors
  imageSchema: z
    .string({ required_error: "Image is required" })
    .trim()
    .min(5, "Filename too short")
    .max(100, "Filename is too long (max 100 characters)")
    .regex(/\.(jpg|jpeg|png|webp)$/i, "Image must be an image (jpg, png, webp)"),

  // schéma de validation des bio
  bioSchema: z
    .string()
    .trim()
    .min(1, { message: "Bio is mandatory" })
    .max(1000, { message: "Bio is too long (max 1000 characters)" })
    .regex(/^[a-zA-Z0-9À-ÿ\s\-',.!?()\n]+$/, { message: "Bio contains invalid characters" }),

  //shema de validation des names
  nameSchema: z
    .string()
    .trim()
    .min(1, { message: "Name is mandatory" })
    .max(100, { message: "Name is too long (max 100 characters)" })
    .regex(/^[a-zA-Z0-9À-ÿ\s\-'&.]+$/, { message: "Name contains invalid characters" }),
};

// Export direct des schémas (sans enveloppe)
export { commonSchema };