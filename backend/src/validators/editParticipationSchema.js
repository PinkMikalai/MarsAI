import { z } from 'zod';
import { email, firstname, lastname, id } from './commonSchema.js';

const contributorSchema = z.object({
    firstname: firstname,
    last_name: lastname,
    email: email.optional().or(z.literal('')),
    production_role: z
        .string({ required_error: "Production role is required" })
        .trim()
        .min(1, "Production role cannot be empty"),
});

const tagSchema = z.object({
    name: z.string({ required_error: "Tag name is required" }).trim().min(1, "Tag name cannot be empty"),
});

const stillSchema = z.object({
    file_name: z.string().trim().min(1, "File name cannot be empty").max(512, "Filename too long"),
});

const editParticipationSchema = z.object({
    token: z.string({ required_error: "Token is required" }).min(1, "Token cannot be empty"),

    title: z.string().trim().max(100, "Title is too long").optional().or(z.literal('')),
    title_en: z.string({ required_error: "Title is required" }).trim().min(1, "Title cannot be empty").max(100, "English title is too long"),

    synopsis: z.string().trim().max(300, "Synopsis is too long").optional().or(z.literal('')),
    synopsis_en: z.string({ required_error: "English synopsis is required" }).trim().min(1).max(300, "English synopsis is too long"),

    tech_resume: z.string({ required_error: "Technical summary is required" }).trim().min(1).max(500, "Technical summary is too long"),
    creative_resume: z.string({ required_error: "Creative summary is required" }).trim().min(1).max(500, "Creative summary is too long"),

    language: z.string({ required_error: "Language is required" }).trim().length(2).transform(val => val.toUpperCase()),
    country: z.string({ required_error: "Country is required" }).trim().length(2).transform(val => val.toUpperCase()),

    classification: z.enum(["100% AI", "Hybrid"], {
        errorMap: () => ({ message: "Please select a valid classification: '100% AI' or 'Hybrid'" }),
    }),

    realisator_firstname: firstname,
    realisator_lastname: lastname,
    realisator_civility: z.enum(["Mr", "Mrs", "Other"], {
        errorMap: () => ({ message: "Civility must be Mr, Mrs, or Other" }),
    }),

    email: email,
    birthdate: z.string({ required_error: "Birthdate is required" }).regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),

    mobile_number: z
        .string({ required_error: "Mobile number is required" })
        .trim()
        .max(20)
        .regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number starting with '+'"),
    phone_number: z.union([z.literal(''), z.string().trim().max(20).regex(/^\+[1-9]\d{1,14}$/)]).optional(),

    address: z.string({ required_error: "Address is required" }).trim().min(5).max(255),

    social_media_links_json: z
        .string({ required_error: "Social media links are required" })
        .min(1)
        .max(1000)
        .refine((val) => {
            try { const p = JSON.parse(val); return typeof p === 'object' && p !== null; } catch { return false; }
        }, "Must be a valid JSON object"),

    // cover et srt_file_name sont optionnels (géré via fichiers multipart)
    cover: z.string().trim().max(512).regex(/\.(jpg|jpeg|png|webp)$/i, "Cover must be an image").optional().or(z.literal('')),
    srt_file_name: z.string().trim().max(512).regex(/\.(srt|vtt)$/i, "Invalid subtitle format").optional().or(z.literal('')),

    contributor: z.array(contributorSchema).min(1, "At least one contributor required").max(50),
    tag: z.array(tagSchema).min(1, "At least one tag required").max(20),
    still: z.array(stillSchema).max(3, "Too many stills").optional().default([]),

    acquisition_source_id: id,
}).strict();

export default editParticipationSchema;
