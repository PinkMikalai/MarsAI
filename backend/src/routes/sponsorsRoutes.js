const { Router } = require("express");
const { 
    createSponsor, 
    getAllSponsors, 
    getSponsorById, 
    updateSponsor, 
    deleteSponsor 
} = require("../controllers/sponsorController.js");

// imports des middlewares
const { uploadFields } = require("../middlewares/uploadMiddleware.js");
const { validate } = require("../middlewares/validate.js");
const { sponsorSchema } = require("../validators/sponsorSchema.js");
const router = Router();



// nos routes avec les methodes

router.post("/", uploadFields, validate(sponsorSchema), createSponsor); 
router.get("/", getAllSponsors);
router.get("/:id", getSponsorById);
router.put("/:id", uploadFields, validate(sponsorSchema), updateSponsor); 
router.delete("/:id", deleteSponsor);

module.exports = router;
