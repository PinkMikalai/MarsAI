import { Router } from "express";
import { createAssignmentController,getAssignmentByVideoController, getAssignmentByUserController, updateAssignmentController, deleteAssignmentController, getSelectorVideoLoadController, getAssignmentDataController } from "../controllers/admin/adminController.js";
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';

const router = Router();

router.post('/assignment', authMiddleware, checkRole([3, 1]), createAssignmentController);
router.get('/assignment/video/:video_id', authMiddleware, checkRole([3, 1]), getAssignmentByVideoController);
router.get('/assignment/user/:user_id', authMiddleware, checkRole([3, 1]), getAssignmentByUserController);
router.put('/assignment/:id', authMiddleware, checkRole([3, 1]), updateAssignmentController);
router.delete('/assignment/:id', authMiddleware, checkRole([3, 1]), deleteAssignmentController);
router.get('/assignment/selector_load', authMiddleware, checkRole([3, 1]), getSelectorVideoLoadController);
router.get('/assignment/data/:video_id', authMiddleware,checkRole([3, 1]), getAssignmentDataController  );


export default router;