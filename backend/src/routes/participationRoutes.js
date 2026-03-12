import { Router } from "express";
const router = Router();
import { validate } from '../middlewares/validate.js';
import participationSchema from '../validators/participationSchema.js';
import editParticipationSchema from '../validators/editParticipationSchema.js';
import { addParticipation, getParticipationDetails, sendEditInvitation, updateParticipation } from '../controllers/participationController.js';
import { uploadFields, processS3Uploads } from '../middlewares/uploadMiddleware.js';
import { handleMulterErrors } from '../middlewares/handleMulterErrors.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';

// Dépôt d'une nouvelle participation
router.post('/', uploadFields, handleMulterErrors, processS3Uploads, validate(participationSchema), addParticipation);

// Récupérer les données d'une participation via token (pour pré-remplir le formulaire)
router.get('/details/:token', getParticipationDetails);

// Admin : envoyer une invitation d'édition à un réalisateur (role 1=Admin, 3=Super_admin)
router.post('/:id/send-edit-invitation', authMiddleware, checkRole([1, 3]), sendEditInvitation);

// Réalisateur : soumettre les modifications de sa participation (token dans le body)
router.put('/edit', uploadFields, handleMulterErrors, processS3Uploads, validate(editParticipationSchema), updateParticipation);

export default router;
