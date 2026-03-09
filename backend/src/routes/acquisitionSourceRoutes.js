import { Router } from "express";
import { getAllAcquisitionSources } from "../controllers/video/acquisitionSourceController.js";

const router = Router();

router.get("/", getAllAcquisitionSources);

export default router;
