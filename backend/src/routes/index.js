import { Router } from "express";
const router = Router();
import authRoute from './authRoutes.js';

router.use('/auth', authRoute);

import videosRoutes from "./videosRoutes.js";
import tagRoutes from "./tagRoutes.js";
import participationRoutes from "./participationRoutes.js";
import sponsorsRoutes from "./sponsorsRoutes.js";
import juryRoutes from "./juryRoutes.js";
import profileRoutes from "./profile.js";
import selectionStatusRoutes from "./selectionStatusRoutes.js";

router.use("/videos", videosRoutes);
router.use("/tags", tagRoutes);
router.use('/participation', participationRoutes);
router.use('/sponsors', sponsorsRoutes);
router.use('/jury', juryRoutes);
router.use('/profile', profileRoutes);
router.use('/selection-status', selectionStatusRoutes);
export default router;
