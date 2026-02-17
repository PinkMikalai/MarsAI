const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    console.log("DEBUG - Fichiers dans req.files :", req.files ? Object.keys(req.files) : "Aucun fichier");
    console.log("DEBUG - Contenu de req.body avant injection :", req.body);
    if (req.files) {
      if (req.files.cover) req.body.cover = req.files.cover[0].filename;
      if (req.files.img) req.body.img = req.files.img[0].filename;
      if (req.files.illustration) req.body.illustration = req.files.illustration[0].filename;
      if (req.files.video_file_name) req.body.video_file_name = req.files.video_file_name[0].filename; 
      if (req.files.srt_file_name) req.body.srt_file_name = req.files.srt_file_name[0].filename;

      if (req.files.still) {
        req.body.still = req.files.still.map(file => ({
          file_name: file.filename
        }));
      } 
    }

    ['contributor', 'tag'].forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]); 
        } catch (e) {
          // on laisse zod gérer l'erreur
        }
      }
    })

    const dataToValidate = source === 'query' ? req.query : req.body;
    console.log("Données reçues pour validation:", dataToValidate); 
    
    const validatedData = schema.parse(dataToValidate);
    console.log("Données après validation Zod:", validatedData); 
    if (source === 'query') {
      req.query = validatedData;
    } else {
      req.body = validatedData;
    }
    
    next();
  } catch (error) {
    console.log("Zod a détecté une erreur !", error); 
    
    if (error.errors && Array.isArray(error.errors)) {
      return res.status(400).json({
        message: 'Data validation error',
        errors: error.errors,
      });
    }
    
    return res.status(400).json({
      message: 'Data validation error',
      error: error.message || 'Unknown error',
    });
  }
};

export { validate };
