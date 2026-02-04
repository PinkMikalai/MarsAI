const { Router } = require("express");
const { 
    createSponsor, 
    getAllSponsors, 
    getSponsorById, 
    updateSponsor, 
    deleteSponsor 
} = require("../controllers/sponsorController.js");
const upload = require("../middlewares/uploadMiddleware.js");
const router = Router();



// nos routes avec les methodes

router.post("/", upload, createSponsor); 
router.get("/", getAllSponsors);
router.get("/:id", getSponsorById);
router.put("/:id", upload, updateSponsor); 
router.delete("/:id", deleteSponsor);

module.exports = router;
