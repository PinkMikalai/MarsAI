const { Router } = require("express");

const router = Router();
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
const { uploadFields } = require("../middlewares/uploadMiddleware.js");
const { validate } = require("../middlewares/validate.js");
const { jurySchema } = require("../validators/jurySchema.js");
const checkRole = require("../middlewares/checkRoleMiddleware.js");


// nos routes avec les methodes

router.post("/", authMiddleware, checkRole(['Super-admin', 'Admin']), uploadFields, validate(jurySchema), createJury);
router.get("/", getAllJury);
router.get("/:id", getJuryById);
router.put("/:id", authMiddleware, checkRole(['Super-admin', 'Admin']), uploadFields, validate(jurySchema), updateJury);
router.delete("/:id", authMiddleware, checkRole(['Super-admin', 'Admin']), deleteJury);

module.exports = router;
