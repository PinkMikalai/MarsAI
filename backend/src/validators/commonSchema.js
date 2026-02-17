import { z } from 'zod';

const email = z
    .string({ required_error: "Email address is required" })
    .trim()
    .email({ message: "Invalid email format" })
    .lowercase();

const passwordBase = z
   .string().min(6, "At least 6 characters")
   .regex(/[0-9]/, "At least one number is required");

const id = z
    .string()
    .regex(/^\d+$/, "ID must be a number")
    .transform(Number);

const date = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val));

const url = z
    .string()
    .trim()
    .refine(
      (val) => {
        const simpleUrlPattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        const fullUrlPattern = /^https?:\/\/([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/;
        return simpleUrlPattern.test(val) || fullUrlPattern.test(val);
      },
      { message: "Invalid URL format. Use either 'example.com' or 'http://example.com' or 'https://example.com'" }
    );

const firstname = z
    .string()
    .trim()
    .min(1, { message: "Firstname is mandatory" })
    .max(50, { message: "Firstname is too long (max 50 characters)" })
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, { message: "Firstname must contain only letters, spaces, hyphens and apostrophes" });

const lastname = z
    .string()
    .trim()
    .min(1, { message: "Lastname is mandatory" })
    .max(50, { message: "Lastname is too long (max 50 characters)" })
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, { message: "Lastname must contain only letters, spaces, hyphens and apostrophes" });

const imageSchema = z
    .string({ required_error: "Image is required" })
    .trim()
    .min(5, "Filename too short")
    .max(100, "Filename is too long (max 100 characters)")
    .regex(/\.(jpg|jpeg|png|webp)$/i, "Image must be an image (jpg, png, webp)");

const bioSchema = z
    .string()
    .trim()
    .min(1, { message: "Bio is mandatory" })
    .max(1000, { message: "Bio is too long (max 1000 characters)" })
    .regex(/^[a-zA-Z0-9À-ÿ\s\-',.!?()\n]+$/, { message: "Bio contains invalid characters" });

const nameSchema = z
    .string()
    .trim()
    .min(1, { message: "Name is mandatory" })
    .max(100, { message: "Name is too long (max 100 characters)" })
    .regex(/^[a-zA-Z0-9À-ÿ\s\-'&.]+$/, { message: "Name contains invalid characters" });

export { email, passwordBase, id, date, url, firstname, lastname, imageSchema, bioSchema, nameSchema };
