import { Router } from "express";
const router = Router();
import { 
    createJury, 
    getAllJury, 
    getJuryById, 
    updateJury, 
    deleteJury 
} from "../controllers/juryController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { uploadFields, processS3Uploads } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { jurySchema } from "../validators/jurySchema.js";
import checkRole from "../middlewares/checkRoleMiddleware.js";

router.post("/", authMiddleware, checkRole([3, 1]), uploadFields, processS3Uploads, validate(jurySchema), createJury);
router.get("/", getAllJury);
router.get("/:id", getJuryById);
router.put("/:id", authMiddleware, checkRole([3, 1]), uploadFields, processS3Uploads, validate(jurySchema), updateJury);
router.delete("/:id", authMiddleware, checkRole([3, 1]), deleteJury);


export default router;
