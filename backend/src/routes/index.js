const express = require("express");
const router = express.Router();
const videosRoutes = require("./videosRoutes");
const tagRoutes = require("./tagRoutes");

//nos routes
router.use("/videos", videosRoutes);
router.use("/tags", tagRoutes);

module.exports = router;

