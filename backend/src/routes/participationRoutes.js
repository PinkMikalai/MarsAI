const { Router } = require("express");
const router = Router();
const { validate } = require('../middlewares/validate');
const participationSchema = require('../validators/participationSchema');
const participationController = require('../controllers/participationController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const { handleMulterErrors } = require('../middlewares/handleMulterErrors');

// Définition des endpoints 
router.post('/', uploadMiddleware, handleMulterErrors, validate(participationSchema), participationController.addParticipation);



module.exports = router;