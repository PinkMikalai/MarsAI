const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    // Si source est 'query', on valide req.query, sinon req.body
    const dataToValidate = source === 'query' ? req.query : req.body;
    console.log("Données reçues pour validation:", dataToValidate); 
    
    const validatedData = schema.parse(dataToValidate);
    console.log("Données après validation Zod:", validatedData); 
    // On réinjecte les données nettoyées au bon endroit
    if (source === 'query') {
      req.query = validatedData;
    } else {
      req.body = validatedData;
    }
    
    next();
  } catch (error) {
    console.log("Zod a détecté une erreur !"); 
    return res.status(400).json({
      message: 'Data validation error',
      errors: error.format(),
    });
  }
};
module.exports = { validate};