import { Router } from "express";
import { 
    createCmsController, 
    getAllCmsController, 
    getActiveCmsController,
    getCmsByIdController, 
    updateCmsController, 
    deleteCmsController 
} from "../../controllers/admin/cmsController.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import checkRole from "../../middlewares/checkRoleMiddleware.js";
const router = Router();

router.post('/create', authMiddleware, checkRole([1, 3]), createCmsController);
router.get('/all', getAllCmsController);
router.get('/active', getActiveCmsController);
router.get('/:id', getCmsByIdController);
router.put('/:id', authMiddleware, checkRole([1, 3]), updateCmsController);
router.delete('/:id', authMiddleware, checkRole([1, 3]), deleteCmsController);


export default router;