import { Router } from "express";
const router = Router();

import { getSelectorAllMemoByUserId } from "../controllers/video/selectorMemoController.js";


import authMiddleware from "../middlewares/authMiddleware.js";
import checkRole from "../middlewares/checkRoleMiddleware.js";



router.get("/selector/memos", authMiddleware, checkRole(["Selector"]), getSelectorAllMemoByUserId);


export default router;