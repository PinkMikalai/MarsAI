const { Router } = require("express");
const { getMostUsedTags } = require("../controllers/video/tagController");

const router = Router();

// nos routes avec les methodes
router.get("/most-used", getMostUsedTags); // afficher les tags les plus utilises

module.exports = router;