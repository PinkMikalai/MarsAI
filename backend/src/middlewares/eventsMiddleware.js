// alertes des events en cas d'erreurs

function validateEvent(req, res, next) {
    const { title, date, capacity } = req.body;
  
    if (!title || typeof title !== "string") {
      return res.status(400).json({
        error: "Le titre est obligatoire et doit être une string",
      });
    }
  
    if (!date) {
      return res.status(400).json({
        error: "La date est obligatoire",
      });
    }
  
    if (capacity !== undefined && isNaN(capacity)) {
      return res.status(400).json({
        error: "La capacité doit être un nombre",
      });
    }
  
    next();
  }
  
  module.exports = validateEvent;
  