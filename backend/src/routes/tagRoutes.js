import { Router } from "express";
import { getMostUsedTags } from "../controllers/video/tagController.js";

const router = Router();

router.get("/most-used", getMostUsedTags);

export default router;
