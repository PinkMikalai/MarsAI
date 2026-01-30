const express = require("express");
const router = express.Router();

// import des routes 
const videoRoutes = require("./videoRoutes");
const participationRoutes = require("./participationRoutes");


// ici, nos routes 
router.use('/video', videoRoutes); 
router.use('/participation', participationRoutes);



module.exports = router;

