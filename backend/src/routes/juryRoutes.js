const { Router } = require("express");
const { 
    createJury, 
    getAllJury, 
    getJuryById, 
    updateJury, 
    deleteJury 
} = require("../controllers/juryController.js");

const upload = require("../middlewares/uploadMiddleware.js");
const router = Router();


// nos routes avec les methodes

router.post("/", upload, createJury);
router.get("/", getAllJury);
router.get("/:id", getJuryById);
router.put("/:id", upload, updateJury);
router.delete("/:id", deleteJury);

module.exports = router;
