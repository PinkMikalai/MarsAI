const { Router } = require("express");
const router = Router();
const { validate } = require('../middlewares/validate');
const participationSchema = require('../validators/participationSchema');
const participationController = require('../controllers/participationController');
const { uploadFields } = require('../middlewares/uploadMiddleware');
const { handleMulterErrors } = require('../middlewares/handleMulterErrors');

// Définition des endpoints 
router.post('/', uploadFields, handleMulterErrors, validate(participationSchema), participationController.addParticipation);

module.exports = router;