import { Router } from "express";
import { getAllAdminStatus } from "../controllers/video/adminStatusController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRole from "../middlewares/checkRoleMiddleware.js";

const router = Router();

// Accessible uniquement aux Admin (1) et Super-admin (3)
router.get("/", authMiddleware, checkRole([1, 3]), getAllAdminStatus);

export default router;
