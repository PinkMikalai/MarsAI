const { Router } = require("express");
const { 
    createVideo, 
    getAllVideos, 
    getVideoById, 
    updateVideo, 
    deleteVideo 
} = require("../controllers/video/videoController");
const { createSelectorMemo } = require("../controllers/video/selectorMemoController");
const optionalAuthMiddleware = require("../middlewares/optionalAuthMiddleware");
const checkRole = require("../middlewares/checkRoleMiddleware");
const router = Router();
const authMiddleware = require("../middlewares/authMiddleware");

// nos routes avec les methodes
router.post("/", createVideo);
router.post("/:id/memo",authMiddleware, checkRole("Selector"), createSelectorMemo); //notation de la video par selector
router.get("/", getAllVideos);
router.get("/:id", optionalAuthMiddleware, getVideoById);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

module.exports = router;