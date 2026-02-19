import { Router } from "express";
import { 
    createVideo, 
    getAllVideos, 
    getVideoById, 
    updateVideo, 
    deleteVideo 
} from "../controllers/video/videoController.js";
import { 
    createSelectorMemo, 
    getAllSelectorMemos, 
    getSelectorMemoById, 
    updateSelectorMemo, 
    deleteSelectorMemo 
} from "../controllers/video/selectorMemoController.js";
import optionalAuthMiddleware from "../middlewares/optionalAuthMiddleware.js";
import checkRole from "../middlewares/checkRoleMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createSelectorMemoSchema, updateSelectorMemoSchema } from "../validators/selectorSchema.js";
const router = Router();

// Routes vidéos
router.post("/", createVideo);
router.get("/", getAllVideos);
router.get("/:id", optionalAuthMiddleware, getVideoById);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

// Routes memos de sélection (notation par les selectors)
router.post("/:id/memo", authMiddleware, checkRole(["Selector"]), validate(createSelectorMemoSchema), createSelectorMemo);
router.get("/memos", authMiddleware, checkRole(["Super-admin", "Admin"]), getAllSelectorMemos);
router.get("/memo/:id", authMiddleware, getSelectorMemoById);
router.put("/memo/:id", authMiddleware, checkRole(["Selector"]), validate(updateSelectorMemoSchema), updateSelectorMemo);
router.delete("/memo/:id", authMiddleware, checkRole(["Selector"]), deleteSelectorMemo);

export default router;
