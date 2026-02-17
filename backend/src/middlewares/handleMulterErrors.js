import multer from 'multer'; 

const handleMulterErrors = (err, req, res, next) => {
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
    if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

export { handleMulterErrors };
