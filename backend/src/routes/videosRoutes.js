import { Router } from "express";
import { 
    createVideo, 
    getAllVideos, 
    getVideoById, 
    updateVideo, 
    deleteVideo 
} from "../controllers/video/videoController.js";
import { createSelectorMemo } from "../controllers/video/selectorMemoController.js";
import optionalAuthMiddleware from "../middlewares/optionalAuthMiddleware.js";
import checkRole from "../middlewares/checkRoleMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/", createVideo);
router.post("/:id/memo", authMiddleware, checkRole("Selector"), createSelectorMemo);
router.get("/", getAllVideos);
router.get("/:id", optionalAuthMiddleware, getVideoById);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

export default router;
