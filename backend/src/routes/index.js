const express = require("express");
const router = express.Router();
const authRoute = require('./authRoutes')

router.use('/auth' , authRoute);

//imports des routes
const videosRoutes = require("./videosRoutes");
const tagRoutes = require("./tagRoutes");
const videoRoutes = require("./videoRoutes");
const participationRoutes = require("./participationRoutes");



//Nos routes
router.use("/videos", videosRoutes);
router.use("/tags", tagRoutes);
router.use('/video', videoRoutes); 
router.use('/participation', participationRoutes);



module.exports = router;

