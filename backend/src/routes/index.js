import { Router } from "express";
import authRoute from './authRoutes.js';
import videosRoutes from "./videosRoutes.js";
import tagRoutes from "./tagRoutes.js";
import participationRoutes from "./participationRoutes.js";
import sponsorsRoutes from "./sponsorsRoutes.js";
import juryRoutes from "./juryRoutes.js";
import eventsRoutes from "./eventsRoutes.js";
import assignmentRoutes from "./assignmentRoutes.js"

const router = Router();

router.use('/auth', authRoute);
router.use("/videos", videosRoutes);
router.use("/tags", tagRoutes);
router.use('/participation', participationRoutes);
router.use('/sponsors', sponsorsRoutes);
router.use('/jury', juryRoutes);
router.use('/events', eventsRoutes);
router.use('/admin', assignmentRoutes);


export default router;
