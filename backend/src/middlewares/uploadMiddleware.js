import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateFileName, uploadFileToS3 } from '../services/uploadService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_BASE = path.join(__dirname, '..', 'assets', 'uploads');

// garder les dossiers locaux pour les fichiers temporaires (ffmpeg / youtube)
const folders = [
    path.join(UPLOAD_BASE, 'videos'),
    path.join(UPLOAD_BASE, 'images'),
    path.join(UPLOAD_BASE, 'srt')
];

folders.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// memoryStorage : les fichiers restent en buffer (pas ecrits sur le disque)
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

const uploadFields = upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'video_file_name', maxCount: 1 },
    { name: 'srt_file_name', maxCount: 1 },
    { name: 'still', maxCount: 3 },
    { name: 'img', maxCount: 1 },
    { name: 'illustration', maxCount: 1 },
]); 

// mapping fieldname -> dossier S3
const FIELD_FOLDERS = {
    video_file_name: 'videos',
    cover: 'images',
    still: 'images',
    img: 'images',
    illustration: 'images',
    srt_file_name: 'srt',
};

// middleware qui upload chaque fichier multer vers S3
// set file.filename = url S3 (pour que validate.js fonctionne sans changement)
async function processS3Uploads(req, res, next) {
    if (!req.files || Object.keys(req.files).length === 0) return next();

    try {
        for (const [fieldname, files] of Object.entries(req.files)) {
            const folder = FIELD_FOLDERS[fieldname] || 'images';

            for (const file of files) {
                const fileName = generateFileName(file.originalname);
                const s3Url = await uploadFileToS3(file.buffer, fileName, folder, file.mimetype);

                file.filename = s3Url;
                file.s3Url = s3Url;
                file.generatedName = fileName;
            }
        }
        next();
    } catch (error) {
        console.error("erreur processS3Uploads:", error);
        res.status(500).json({
            message: "erreur lors de l'upload des fichiers sur S3",
            error: error.message,
        });
    }
}

export { uploadFields, processS3Uploads, UPLOAD_BASE };
