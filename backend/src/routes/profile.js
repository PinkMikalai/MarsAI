import { Router } from "express";
const router = Router();

import { getSelectorAllMemoByUserId, getSelectorAssignments } from "../controllers/video/selectorMemoController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import checkRole from "../middlewares/checkRoleMiddleware.js";


router.get("/selector/memos", authMiddleware, checkRole([2]), getSelectorAllMemoByUserId);
router.get("/selector/assignments", authMiddleware, checkRole([2]) , getSelectorAssignments);


export default router;