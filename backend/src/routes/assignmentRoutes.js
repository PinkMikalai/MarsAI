import { Router } from "express";
import { createAssignmentController,getAssignmentByVideoController, getAssignmentByUserController, updateAssignmentController, deleteAssignmentController, getSelectorVideoLoadController, getAssignmentDataController } from "../controllers/admin/adminController.js";
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';


const router = Router();

router.post('/assignment', authMiddleware, checkRole(['Super_admin', 'Admin']) ,createAssignmentController);
router.get('/assignment/video/:video_id', authMiddleware, checkRole(['Super_admin', 'Admin']), getAssignmentByVideoController);
router.get('/assignment/user/:user_id', authMiddleware, checkRole(['Super_admin', 'Admin']), getAssignmentByUserController);
router.put('/assignment/:id',authMiddleware, checkRole(['Super_admin', 'Admin']), updateAssignmentController);
router.delete('/assignment/:id', authMiddleware, checkRole(['Super_admin', 'Admin']), deleteAssignmentController);
router.get('/assignment/selector_load', authMiddleware,checkRole(['Super_admin', 'Admin']), getSelectorVideoLoadController );
router.get('/assignment/data/:video_id', authMiddleware,checkRole(['Super_admin', 'Admin']), getAssignmentDataController  )

export default router;