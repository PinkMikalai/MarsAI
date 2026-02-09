const multer = require('multer'); // middleware Express qui gère les reqêtes multipart/form-data utilisés pour l'upload de fichiers 
const path = require('path'); 
const fs = require('fs'); // Ajouté pour la gestion des dossiers 

// Création automatique de dossier de stockage si non présent 
const UPLOAD_BASE = path.join(__dirname, '..', 'assets', 'uploads'); // chemin racine où tous les fichiers seront stockés
// on crée un tableau contenant les chemins complets de chaque sous-dossier 
const folders = [
    path.join(UPLOAD_BASE, 'videos'),
    path.join(UPLOAD_BASE, 'images'),
    path.join(UPLOAD_BASE, 'srt')
];

folders.forEach(dir => {
    // fs.existsSync vérifie si le dossier existe déjà 
    if(!fs.existsSync(dir)) {
        // si le dossier n'existe pas, on le crée
        fs.mkdirSync(dir, { recursive: true }); // {recursive: true} crée les dossiers parents (assets/uploads) s'ils manquent aussi 
    }
})

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

// Limitation de la taille des fichiers 
const upload = multer({ 
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // Limite à 100Mo par fichier 
    }
});

// exportation des champs configurés 
const uploadFields = upload.fields([
    { name:'cover', maxCount: 1 },
    { name: 'video_file_name', maxCount: 1 },
    { name: 'srt_file_name', maxCount: 1},
    { name: 'still', maxCount: 3 },
    { name: 'img', maxCount: 1 },
    { name: 'illustration', maxCount: 1 },
]); 

module.exports = {
    uploadFields,
    UPLOAD_BASE
};
