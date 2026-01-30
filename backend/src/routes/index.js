const express = require("express");
const router = express.Router();
const authRoute = require('./authRoutes')

router.use('/auth' , authRoute);




module.exports = router;

