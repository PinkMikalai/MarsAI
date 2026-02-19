import { z } from 'zod';


const createSelectorMemoSchema = z.object({
    rating: z.coerce.number().int().min(0).max(10).optional(),
    comment: z.string().trim().max(2000).optional(),
    selection_status_id: z.coerce.number().int().min(1).max(6).optional(),
}).refine(
    (data) => data.rating !== undefined || data.comment !== undefined || data.selection_status_id !== undefined,
    { message: "Au moins un champ (rating, comment ou selection_status_id) est requis" }
);

const updateSelectorMemoSchema = z.object({
    rating: z.coerce.number().int().min(0).max(10).optional(),
    comment: z.string().trim().max(2000).optional(),
    selection_status_id: z.coerce.number().int().min(1).max(6).optional(),
});

export { createSelectorMemoSchema, updateSelectorMemoSchema };
