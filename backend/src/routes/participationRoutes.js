import { Router } from "express";
const router = Router();
import { validate } from '../middlewares/validate.js';
import participationSchema from '../validators/participationSchema.js';
import { addParticipation } from '../controllers/participationController.js';
import { uploadFields, processS3Uploads } from '../middlewares/uploadMiddleware.js';
import { handleMulterErrors } from '../middlewares/handleMulterErrors.js';

router.post('/', uploadFields, handleMulterErrors, processS3Uploads, validate(participationSchema), addParticipation);

export default router;
