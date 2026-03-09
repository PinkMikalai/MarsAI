import { z } from 'zod';  
import { COUNTRIES_ISO3166 } from '../constants/countries.js';
import { commonSchema } from './commonSchema.js';

const { email, firstname, lastname } = commonSchema;

const validCountryCodes = COUNTRIES_ISO3166.map(c => c.value);
const phoneRegex = /^\+[1-9]\d{1,14}$/;

const contributorSchema = z.object({
    firstname: firstname,
    last_name: lastname,
    email: email,
    gender: z.enum(["Mr", "Mrs", "Other"], { errorMap: () => ({ message: "err_gender_invalid" }) }),
    production_role: z
        .string({ required_error: "err_role_required" })
        .trim()
        .min(1, "err_role_empty")
});

const tagSchema = z.object({
    name: z
        .string({ required_error: "err_tag_name_required" })
        .trim()
        .min(1, "err_tag_name_empty")
});

const socialLinkSchema = z.object({
    platform: z.string().min(1, "err_social_platform_required"),
    url: z
        .string()
        .trim()
        .url("err_social_url_invalid")
        .min(1, "err_social_url_empty")
});

const stillSchema = z.object({
    file_name: z
        .string()
        .trim()
        .min(1, "err_filename_too_short")
        .max(512, "err_filename_too_long")
});

const participationSchema = z.object({

    title: z
        .string()
        .trim()
        .max(100, "err_title_too_long")
        .optional()
        .or(z.literal("")),

    title_en: z
        .string({ required_error: "err_title_en_required" })
        .trim()
        .min(1, "err_title_en_empty")
        .max(100, "err_title_en_too_long"),

    synopsis: z
        .string()
        .trim()
        .max(300, "err_synopsis_too_long")
        .optional()
        .or(z.literal("")),

    synopsis_en: z
        .string({ required_error: "err_synopsis_en_required" })
        .trim()
        .min(1, "err_synopsis_en_empty")
        .max(300, "err_synopsis_en_too_long"),

    tech_resume: z
        .string({ required_error: "err_tech_resume_required" })
        .trim()
        .min(1, "err_tech_resume_empty")
        .max(500, "err_tech_resume_too_long"),

    creative_resume: z
        .string({ required_error: "err_creative_resume_required" })
        .trim()
        .min(1, "err_creative_resume_empty")
        .max(500, "err_creative_resume_too_long"),

    duration: z.coerce
        .number()
        .int()
        .positive()
        .max(120, "err_duration_too_long")
        .optional(),

    language: z
        .string({ required_error: "err_language_required" })
        .trim()
        .length(2, "err_language_format")
        .transform(val => val.toUpperCase()),

    country: z
        .string({ required_error: "err_country_required" })
        .min(1, "err_country_required")
        .refine((val) => validCountryCodes.includes(val), {
            message: "err_country_invalid_format",
        }),

    classification: z
        .enum(["100% AI", "Hybrid"], { errorMap: () => ({ message: "err_classification_invalid" }) }),

    realisator_firstname: firstname,
    realisator_lastname: lastname,
    realisator_civility: z
        .string()
        .min(1, { message: "err_civility_invalid" })
        .superRefine((val, ctx) => {
            if (!["Mr", "Mrs", "Other"].includes(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "err_civility_invalid",
                    fatal: true
                });
            }
        }),

    email: email,

    birthdate: z
        .string({ required_error: "err_birthdate_required" })
        .min(1, "err_birthdate_required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "err_birthdate_format")
        .refine((val) => {
            const birthDate = new Date(val);
            if (isNaN(birthDate.getTime())) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
            eighteenYearsAgo.setHours(0, 0, 0, 0);
            const minYearAllowed = new Date("1925-01-01");
            return birthDate <= eighteenYearsAgo && birthDate >= minYearAllowed;
        }, { message: "err_birthdate_age" }),

    mobile_number: z
        .string({ required_error: "err_mobile_required" })
        .trim()
        .min(10, "err_mobile_too_short")
        .max(17, "err_mobile_too_long")
        .regex(phoneRegex, "err_phone_format"),

    phone_number: z
        .union([
            z.literal(""),
            z.string()
                .trim()
                .min(10, "err_phone_too_short")
                .max(17, "err_phone_too_long")
                .regex(phoneRegex, "err_phone_format"),
        ]).optional(),

    address: z
        .string({ required_error: "err_address_required" })
        .trim()
        .min(5, "err_address_too_short")
        .max(255, "err_address_too_long")
        .refine((val) => !/[<>]/.test(val), {
            message: "err_address_invalid_chars"
        }),

    social_links: z
        .array(socialLinkSchema)
        .max(10, "err_social_links_max")
        .optional()
        .default([]),

    cover: z
        .string({ required_error: "err_cover_required" })
        .trim()
        .min(5, "err_cover_filename_too_short")
        .max(512, "err_cover_filename_too_long")
        .regex(/\.(jpg|jpeg|png|webp)$/i, "err_cover_format"),

    video_file_name: z
        .string({ required_error: "err_video_required" })
        .trim()
        .min(5, "err_video_filename_too_short")
        .max(512, "err_video_filename_too_long")
        .regex(/\.(mp4|mov|avi|mkv)$/i, "err_video_format"),

    srt_file_name: z
        .string()
        .max(512, "err_filename_too_long")
        .trim()
        .regex(/\.(srt|vtt)$/i, "err_srt_format")
        .optional()
        .or(z.literal("")),

    youtube_url: z
        .url("err_youtube_url_invalid")
        .max(255, "err_youtube_url_too_long")
        .regex(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/, "err_youtube_url_format")
        .optional(),

    contributor: z
        .array(contributorSchema)
        .min(1, "err_contributor_min")
        .max(50, "err_contributor_max"),

    tag: z
        .array(tagSchema)
        .min(1, "err_tag_min")
        .max(20, "err_tag_max"),

    still: z
        .array(stillSchema)
        .max(3, "err_stills_max")
        .optional()
        .default([]),

    acquisition_source_id: z
        .string({ required_error: "err_acquisition_source_required" })
        .min(1, "err_acquisition_source_required")
        .regex(/^\d+$/, "err_acquisition_source_required")
        .transform(Number),

}).strict();


// Schéma étape 2 — données film (clés du contexte: "description" pour synopsis FR)
const filmStepSchema = z.object({
    title: z
        .string()
        .trim()
        .max(100, "err_title_too_long")
        .optional()
        .or(z.literal("")),
    title_en: z
        .string({ required_error: "err_title_en_required" })
        .trim()
        .min(1, "err_title_en_empty")
        .max(100, "err_title_en_too_long"),
    description: z
        .string()
        .trim()
        .max(300, "err_synopsis_too_long")
        .optional()
        .or(z.literal("")),
    synopsis_en: z
        .string({ required_error: "err_synopsis_en_required" })
        .trim()
        .min(1, "err_synopsis_en_empty")
        .max(300, "err_synopsis_en_too_long"),
    tech_resume: z
        .string({ required_error: "err_tech_resume_required" })
        .trim()
        .min(1, "err_tech_resume_empty")
        .max(500, "err_tech_resume_too_long"),
    creative_resume: z
        .string({ required_error: "err_creative_resume_required" })
        .trim()
        .min(1, "err_creative_resume_empty")
        .max(500, "err_creative_resume_too_long"),
    language: z
        .string({ required_error: "err_language_required" })
        .trim()
        .length(2, "err_language_format"),
    classification: z
        .enum(["100% AI", "Hybrid"], { errorMap: () => ({ message: "err_classification_invalid" }) }),
}).passthrough();

// Schéma étape 1 — données participant (.passthrough pour ignorer mobile_country, phone_country)
const participantSchema = participationSchema.pick({
    realisator_civility: true,
    realisator_firstname: true,
    realisator_lastname: true,
    email: true,
    birthdate: true,
    country: true,
    mobile_number: true,
    phone_number: true,
    address: true,
    social_links: true,
}).passthrough();

export {
    participationSchema,
    participantSchema,
    filmStepSchema,
    contributorSchema,
    tagSchema,
    stillSchema
};
