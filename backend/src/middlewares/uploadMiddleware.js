import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_BASE = path.join(__dirname, '..', 'assets', 'uploads');
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = path.join(__dirname, '..', 'assets', 'uploads');

        if (file.fieldname === 'video_file_name') {
            folder = path.join(folder, 'videos');
        } else if (file.fieldname === 'cover' || file.fieldname === 'still' || file.fieldname === 'img' || file.fieldname === 'illustration') {
            folder = path.join(folder, 'images'); 
        } else if (file.fieldname === 'srt_file_name') {
            folder = path.join(folder, 'srt')
        } 
        cb(null, folder); 
    }, 

    filename: (req, file, cb) => {
        const originalName = path.parse(file.originalname).name; 
        const sanitizedName = originalName.replace(/\s+/g, '-');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, sanitizedName + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

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

export { uploadFields, UPLOAD_BASE };
