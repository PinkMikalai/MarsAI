const { Router } = require("express");
const router = Router();

const participationController = require('../controllers/participationController');

// Définition des endpoints 
router.post('/', participationController.addParticipation);



module.exports = router;