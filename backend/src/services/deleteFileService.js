// DELETE FILE SERVICE - suppression de fichiers (S3 ou local pour retrocompatibilite)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { deleteFileFromS3 } from './uploadService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// supprimer un ancien fichier (S3 ou local)
async function deleteOldFile(fileName, fileType = 'images') {
    if (!fileName) return false;

    try {
        // si c est une url S3 (https://...) on supprime sur S3
        if (fileName.startsWith('http')) {
            return await deleteFileFromS3(fileName);
        }

        // sinon on supprime en local (anciens fichiers avant migration S3)
        const filePath = path.join(__dirname, '..', 'assets', 'uploads', fileType, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("fichier local supprime:", fileName);
            return true;
        } else {
            console.log("fichier local non trouve:", fileName);
            return false;
        }
    } catch (error) {
        console.error("erreur deleteOldFile:", error);
        return false;
    }
}

// supprimer plusieurs fichiers (stills par exemple)
async function deleteMultipleFiles(fileNames = [], fileType = 'images') {
    if (!Array.isArray(fileNames) || fileNames.length === 0) {
        return { success: 0, failed: 0 };
    }

    let successCount = 0;
    let failedCount = 0;

    for (const fileName of fileNames) {
        const deleted = await deleteOldFile(fileName, fileType);
        if (deleted) {
            successCount++;
        } else {
            failedCount++;
        }
    }

    return { success: successCount, failed: failedCount };
}

export { deleteOldFile, deleteMultipleFiles };
