const { Router } = require("express");
const router = Router();
const { validate } = require('../middlewares/validate');
const participationSchema = require('../validators/participationSchema');
const participationController = require('../controllers/participationController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Définition des endpoints 
router.post('/', uploadMiddleware, validate(participationSchema), participationController.addParticipation);



module.exports = router;