const multer = require('multer'); 

const handleMulterErrors = (err, req,  res, next) => {
    // si l'erreur vient de  multer 
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(200).json({
                message: "Le fichier est trop volumineux. La limite est de 100 Mo."
            });
        }
        return res.status(400).json({
            message: "Erreur Multer : " + err.message
        })
    }
    // Si c'est une autre erreur (ex: format de fichier refusé)
    if (err) {
        return res.status(400).json({ message: err.message });
    }
    // Si tout va bien, on passe au middleware suivant (Zod ou Controller)
    next();
};
module.exports = { handleMulterErrors };