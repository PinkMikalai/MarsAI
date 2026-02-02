const express = require("express");
const router = express.Router();

//imports des routes
const videosRoutes = require("./videosRoutes");
const tagRoutes = require("./tagRoutes");
const participationRoutes = require("./participationRoutes");
const sponsorsRoutes = require("./sponsorsRoutes");



//Nos routes
router.use("/videos", videosRoutes);
router.use("/tags", tagRoutes);
router.use('/participation', participationRoutes);
router.use('/sponsors', sponsorsRoutes);


module.exports = router;

