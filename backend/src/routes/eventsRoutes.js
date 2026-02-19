import { Router } from "express";
const router = Router();

import {
createEvent,
getAllEvents,
getEventById,
updateEvent,
deleteEvent

} from "../controllers/eventController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { uploadFields } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { eventSchema } from "../validators/eventSchema.js";
import checkRole from "../middlewares/checkRoleMiddleware.js";

router.post("/", authMiddleware, checkRole(['Super-admin', 'Admin']), uploadFields, validate(eventSchema), createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", authMiddleware, checkRole(['Super-admin', 'Admin']), uploadFields, validate(eventSchema), updateEvent);
router.delete("/:id", authMiddleware, checkRole(['Super-admin', 'Admin']), deleteEvent);

export default router;