// DELETE FILE SERVICE - suppression d anciens fichiers lors des updates

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// supprimer un ancien fichier
function deleteOldFile(fileName, fileType = 'images') {
    console.log("test delete old file");
    console.log("fileName:", fileName);
    console.log("fileType:", fileType);

    // si pas de fichier on retourne false
    if (!fileName) {
        console.log("pas de fichier a supprimer");
        return false;
    }

    try {
        // construction du chemin du fichier
        const filePath = path.join(__dirname, '..', 'assets', 'uploads', fileType, fileName);
        

        // verifier si le fichier existe
        if (fs.existsSync(filePath)) {
            // supprimer le fichier
            fs.unlinkSync(filePath);
            console.log("fichier supprime:", fileName);
            return true;
        } else {
            console.log("fichier non trouve:", fileName);
            return false;
        }
    } catch (error) {
        console.error("erreur deleteOldFile:", error);
        console.error("erreur message:", error.message);
        return false;
    }
}

// supprimer plusieurs fichiers (stills par exemple)
function deleteMultipleFiles(fileNames = [], fileType = 'images') {
    console.log("fileNames:", fileNames);
    console.log("fileType:", fileType);

    // si pas de fichiers on retourne
    if (!Array.isArray(fileNames) || fileNames.length === 0) {
        console.log("aucun fichier a supprimer");
        return { success: 0, failed: 0 };
    }

    let successCount = 0;
    let failedCount = 0;

    // supprimer chaque fichier
    fileNames.forEach(fileName => {
        console.log("suppression de:", fileName);
        const deleted = deleteOldFile(fileName, fileType);
        
        if (deleted) {
            successCount++;
        } else {
            failedCount++;
        }
    });

    console.log("fichiers supprimes:", successCount);
    console.log("fichiers non supprimes:", failedCount);
    
    return { 
        success: successCount, 
        failed: failedCount 
    };
}

export { deleteOldFile, deleteMultipleFiles };
