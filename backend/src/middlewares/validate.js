const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    // extraction des fichiers multer
    if (req.files) {
      // pour les fichiers uniques (maxCount: 1)
      if (req.files.cover) req.body.cover = req.files.cover[0].filename;
      if (req.files.img) req.body.img = req.files.img[0].filename;
      if (req.files.illustration) req.body.illustration = req.files.illustration[0].filename;
      if (req.files.video_file_name) req.body.video_file_name = req.files.video_file_name[0].filename; 
      if (req.files.srt_file_name) req.body.srt_file_name = req.files.srt_file_name[0].filename;

      // pour les stills, plusieurs fichiers possibles donc transformation du tableau de fichiers en un tableau d'objet pour le schéma de validation
      if (req.files.still) {
        req.body.still = req.files.still.map(file => ({
          file_name: file.filename
        }));
      } 
    }

    // transformation des strings de postman en objets/tableaux réels 
    ['contributor', 'tag'].forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]); 
        } catch (e) {
          // on laisse zod gérer l'erreur
        }
      }
    })

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
    const errorDetails = error.format ? error.format() : { message: error.message };
    return res.status(400).json({
      message: 'Data validation error',
      errors: errorDetails,
    });
  }
};
module.exports = { validate};