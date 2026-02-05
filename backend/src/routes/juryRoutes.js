const { Router } = require("express");

//
const { 
    createJury, 
    getAllJury, 
    getJuryById, 
    updateJury, 
    deleteJury 
} = require("../controllers/juryController.js");


// imports des middlewares
const authMiddleware = require("../middlewares/authMiddleware.js");
const checkRoleMiddleware = require("../middlewares/checkRoleMiddleware.js")
const upload = require("../middlewares/uploadMiddleware.js");
const { validate } = require("../middlewares/validate.js");
const { jurySchema } = require("../validators/jurySchema.js");
const router = Router();


// nos routes avec les methodes

router.post("/", authMiddleware, checkRoleMiddleware(['Admin' , 'Super-admin']) ,upload, validate(jurySchema), createJury);
router.get("/", getAllJury);
router.get("/:id", getJuryById);
router.put("/:id", upload, validate(jurySchema), updateJury);
router.delete("/:id", deleteJury);

module.exports = router;
