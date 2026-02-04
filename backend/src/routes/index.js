const express = require("express");
const router = express.Router();
const authRoute = require('./authRoutes')

router.use('/auth' , authRoute);

//imports des routes
const videosRoutes = require("./videosRoutes");
const tagRoutes = require("./tagRoutes");
const participationRoutes = require("./participationRoutes");
const sponsorsRoutes = require("./sponsorsRoutes");
const juryRoutes = require("./juryRoutes");



//Nos routes
router.use("/videos", videosRoutes);
router.use("/tags", tagRoutes);
router.use('/participation', participationRoutes);
router.use('/sponsors', sponsorsRoutes);
router.use('/jury', juryRoutes);

module.exports = router;

