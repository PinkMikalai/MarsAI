import { z } from 'zod';
import { email, firstname, lastname, id, date, url } from './commonSchema.js';

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

const tagSchema = z.object({
    name: z
        .string({required_error: "Tag name is required"})
        .trim()
        .min(1, "Tag name cannot be empty")
}); 

const stillSchema = z.object({
    file_name: z
        .string()
        .trim()
        .min(1, "File name cannot be empty")
        .max(100, "Filename too long")
});

const participationSchema = z.object({
    title: z
        .string()
        .trim()
        .max(100, "Title is too long (maximum 100 characters)")
        .optional()
        .or(z.literal("")),

    title_en: z
        .string({ required_error: "Title is required" })
        .trim()
        .min(1, "Title cannot be empty")
        .max(100, "English title is too long (max 100 chars)"),

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

    duration: z.coerce
        .number()
        .int()
        .positive()
        .max(120, "Duration cannot exceed 120 seconds")
        .optional(),

    language: z
        .string({ required_error: "Language is required" })
        .trim()
        .length(2, "Please use a 2-letter language code (e.g., 'en', 'fr')")
        .transform(val => val.toUpperCase()),

    country: z
        .string({ required_error: "Country is required" })
        .trim()
        .length(2, "Please use a 2-letter country code (e.g., 'FR', 'US')")
        .transform(val => val.toUpperCase()),

    classification: z
        .enum(["100% AI", "Hybrid"], {errorMap: () => ({ message: "Please select a valid classification: '100% AI' or 'Hybrid'" })
        }),

    realisator_firstname: firstname,
    realisator_lastname: lastname,
    realisator_civility: z
        .enum(["Mr", "Mrs", "Other"], {errorMap: () => ({ message: "Civility must be Mr, Mrs, or Other" })
    }),

    email: email, 
    birthdate: z
        .string({ required_error: "Birthdate is required" })
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD (e.g., 1990-05-15)"),
    mobile_number: z
        .string({ required_error: "Mobile number is required" })
        .trim()
        .max(20, "Phone number too long")
        .regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number starting with '+' and your country code (e.g., +33612345678)"),
    phone_number: z
        .union([
            z.literal(""),
            z.string().trim().max(20, "Phone number too long").regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number (e.g., +33123456789)"),
        ])
        .optional(),
    address: z
        .string({ required_error: "Address is required" })
        .trim()
        .min(5, "Please enter a complete address (minimum 5 characters)")
        .max(255, "Address too long (max 255)"),

    social_media_links_json: z
        .string({ required_error: "Social media links are required" })
        .min(1, "Social media links cannot be empty")
        .max(1000, "JSON data too large (max 1000 chars)")
        .refine((val) => {
            try {
                const parsed = JSON.parse(val);
                return typeof parsed === 'object' && parsed !== null;
            } catch (e) {
                return false;
            }
        }, "Social media links must be a valid JSON object"),

    cover: z
        .string({ required_error: "Cover image is required" })
        .trim()
        .min(5, "Filename too short")
        .max(100, "Filename is too long (max 100 characters)")
        .regex(/\.(jpg|jpeg|png|webp)$/i, "Cover must be an image (jpg, png, webp)"),

    video_file_name: z
        .string({ required_error: "Video file is required" })
        .trim()
        .min(5, "Filename too short")
        .max(100, "Filename too long")
        .regex(/\.(mp4|mov|avi|mkv)$/i, "Invalid video format"),

    srt_file_name: z
        .string()
        .max(100, "Filename too long")
        .trim()
        .regex(/\.(srt|vtt)$/i, "Invalid subtitle format (.srt or .vtt)")
        .optional()
        .or(z.literal("")),

    youtube_url: z
        .url("Invalid URL format")
        .max(255, "URL is too long")
        .regex(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/, "Must be a valid YouTube URL")
        .optional(),

    contributor: z
        .array(contributorSchema)
        .min(1, "At least one contributor required")
        .max(50, "Too many contributors"),

    tag: z
        .array(tagSchema)
        .min(1, "At least one tag required")
        .max(20, "Too many tags"),

    still: z
        .array(stillSchema)
        .max(3, "Too many stills")
        .optional()
        .default([]),

    acquisition_source_id: id,

}).strict();

export default participationSchema;
