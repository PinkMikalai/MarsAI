import { Router } from "express";
import { 
    createSponsor, 
    getAllSponsors, 
    getSponsorById, 
    updateSponsor, 
    deleteSponsor 
} from "../controllers/sponsorController.js";
const router = Router();

import { uploadFields } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { sponsorSchema } from "../validators/sponsorSchema.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRole from "../middlewares/checkRoleMiddleware.js";

router.post("/", authMiddleware, checkRole(['Super-admin', 'Admin']), uploadFields, validate(sponsorSchema), createSponsor); 
router.get("/", getAllSponsors);
router.get("/:id", getSponsorById);
router.put("/:id", authMiddleware, checkRole(['Super-admin', 'Admin']), uploadFields, validate(sponsorSchema), updateSponsor); 
router.delete("/:id", authMiddleware, checkRole(['Super-admin', 'Admin']), deleteSponsor);

export default router;
