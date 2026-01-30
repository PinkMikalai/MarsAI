const { Router } = require("express");
const router = Router();
const { validate } = require('../middlewares/validate');
const participationSchema = require('../validators/participationSchema');
const participationController = require('../controllers/participationController');

// Définition des endpoints 
router.post('/', validate(participationSchema), participationController.addParticipation);



module.exports = router;