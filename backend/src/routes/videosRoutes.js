const { Router } = require("express");
const { 
    createVideo, 
    getAllVideos, 
    getVideoById, 
    updateVideo, 
    deleteVideo 
} = require("../controllers/video/videoController");


const router = Router();

// nos routes avec les methodes
router.post("/", createVideo);
router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

module.exports = router;