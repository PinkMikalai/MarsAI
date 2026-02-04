const { Router } = require("express");
const { 
    createSponsor, 
    getAllSponsors, 
    getSponsorById, 
    updateSponsor, 
    deleteSponsor 
} = require("../controllers/sponsorController.js");

// imports des middlewares
const upload = require("../middlewares/uploadMiddleware.js");
const { validate } = require("../middlewares/validate.js");
const { sponsorSchema } = require("../validators/sponsorSchema.js");
const router = Router();



// nos routes avec les methodes

router.post("/", upload, validate(sponsorSchema), createSponsor); 
router.get("/", getAllSponsors);
router.get("/:id", getSponsorById);
router.put("/:id", upload, validate(sponsorSchema), updateSponsor); 
router.delete("/:id", deleteSponsor);

module.exports = router;
