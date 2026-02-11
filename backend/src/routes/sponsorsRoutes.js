const { Router } = require("express");
const { 
    createSponsor, 
    getAllSponsors, 
    getSponsorById, 
    updateSponsor, 
    deleteSponsor 
} = require("../controllers/sponsorController.js");
const router = Router();


// imports des middlewares
const upload = require("../middlewares/uploadMiddleware.js");
const { validate } = require("../middlewares/validate.js");
const { sponsorSchema } = require("../validators/sponsorSchema.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const checkRole = require("../middlewares/checkRoleMiddleware.js");




// nos routes avec les methodes

router.post("/", authMiddleware, checkRole(['Super-admin', 'Admin']), upload, validate(sponsorSchema), createSponsor); 
router.get("/", getAllSponsors);
router.get("/:id", getSponsorById);
router.put("/:id", authMiddleware, checkRole(['Super-admin', 'Admin']), upload, validate(sponsorSchema), updateSponsor); 
router.delete("/:id", authMiddleware, checkRole(['Super-admin', 'Admin']), deleteSponsor);

module.exports = router;
