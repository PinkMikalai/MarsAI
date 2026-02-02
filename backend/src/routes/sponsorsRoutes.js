const { Router } = require("express");
const { createSponsor, getAllSponsors, getSponsorById, updateSponsor, deleteSponsor } = require("../controllers/sponsorController");
const router = Router();



// nos routes avec les methodes

router.post("/", createSponsor);
router.get("/", getAllSponsors);
router.get("/:id", getSponsorById);
router.put("/:id", updateSponsor);
router.delete("/:id", deleteSponsor);

module.exports = router;
