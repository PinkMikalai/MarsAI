import { Router } from "express";
import { 
    createCmsController, 
    getAllCmsController, 
    getCmsByIdController, 
    updateCmsController, 
    deleteCmsController 
} from "../../controllers/admin/cmsController.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import checkRole from "../../middlewares/checkRoleMiddleware.js";
import { uploadFields, processS3Uploads } from "../../middlewares/uploadMiddleware.js";
const router = Router();

router.post('/create', authMiddleware, checkRole([1, 3]), uploadFields, processS3Uploads, createCmsController);
router.get('/all', getAllCmsController);
router.get('/:id', getCmsByIdController);
router.put('/:id', authMiddleware, checkRole([1, 3]), uploadFields, processS3Uploads, updateCmsController);
router.delete('/:id', authMiddleware, checkRole([1, 3]), deleteCmsController);


export default router;