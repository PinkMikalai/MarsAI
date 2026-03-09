import { Router } from "express";
import { getAllSelectionStatus } from "../controllers/video/selectionStatusController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRole from "../middlewares/checkRoleMiddleware.js";

const router = Router();

// Récupérer tous les statuts de sélection (accessible aux selectors, admins)
router.get("/", authMiddleware, checkRole([2, 1, 3]), getAllSelectionStatus);

export default router;
