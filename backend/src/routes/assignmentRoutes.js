import { Router } from "express";
import { createAssignmentController, updateAssignmentController, deleteAssignmentController } from "../controllers/admin/adminController.js";
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';


const router = Router();

router.post('/assignment', authMiddleware, checkRole(['Super-admin', 'Admin']) ,createAssignmentController);
router.put('/assignment/:id',authMiddleware, checkRole(['Super-admin', 'Admin']), updateAssignmentController);
router.delete('/assignment/:id', authMiddleware, checkRole(['Super-admin', 'Admin']), deleteAssignmentController);

export default router;