// =====================================================
// UPLOAD - MIDDLEWARE
// =====================================================

const multer = require('multer'); 
const path = require('path'); 

// configuration du stockage 
const storage = multer.diskStorage({
    // définition de la destion (là où est enregistré le fichier)
    destination: (req, file, cb) => {
        // initialisation du chemin de base : "assets/uploads"
        let folder = path.join(__dirname,'..', 'assets', 'uploads');

        // on aiguille le fichier vers le bon sous-dossier selon le nom du champ (fieldname)
        if (file.fieldname === 'video_file_name') {
            // pour les fichiers videos 
            folder = path.join(folder, 'videos');
        } else if (file.fieldname === 'cover' || file.fieldname === 'still' || file.fieldname === 'img' || file.fieldname === 'illustration') {
            // pour les fichiers images 
            folder = path.join(folder, 'images'); 
        } else if (file.fieldname === 'srt_file_name') {
            // pour les fichiers de sous-titres 
            folder = path.join(folder, 'srt')
        } 
        // appel du callback, null pas d'erreur, folder (le chemin final choisi)
        cb(null, folder); 
    }, 

    // définition du nom du fichier 
    filename: (req, file, cb) => {
        // on récupère le nom d'origine sans l'extension 
        const originalName = path.parse(file.originalname).name; 
        // On nettoie le nom, on remplace les espaces par des tirets 
        const sanitizedName = originalName.replace(/\s+/g, '-');
        // création d'un suffixe unique (Timestamp actuel + nbre aléatoire entre 1 et 1 milliard)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // construction du nom final : fieldname + suffixe + extension originale
        cb(null, sanitizedName + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage });

// exportation des champs configurés 
module.exports = upload.fields([
    { name:'cover', maxCount: 1 },
    { name: 'video_file_name', maxCount: 1 },
    { name: 'srt_file_name', maxCount: 1},
    { name: 'still', maxCount: 3 },
    { name: 'img', maxCount: 1 },
    { name: 'illustration', maxCount: 1 },
]); 
