import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

const s3Client = new S3Client({
    region: process.env.SCALEWAY_REGION || 'fr-par',
    endpoint: process.env.SCALEWAY_ENDPOINT || 'https://s3.fr-par.scw.cloud',
    credentials: {
        accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
        secretAccessKey: process.env.SCALEWAY_SECRET_KEY,
    },
    forcePathStyle: false,
});

const BUCKET = process.env.SCALEWAY_BUCKET_NAME;
const FOLDER = process.env.SCALEWAY_FOLDER;

// generer un nom de fichier unique (sans espaces ni caracteres speciaux)
function generateFileName(originalName) {
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext)
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9\-_.]/g, '');
    return `${base}-${Date.now()}-${Math.floor(Math.random() * 1_000_000_000)}${ext}`;
}

// construire la cle S3 : grp3/videos/filename.mp4
function getS3Key(fileName, folder) {
    return `${FOLDER}/${folder}/${fileName}`;
}

// construire l url publique S3
function getS3PublicUrl(key) {
    return `${process.env.SCALEWAY_ENDPOINT}/${BUCKET}/${key}`;
}

// uploader un fichier (buffer) vers S3 et retourner l url publique
async function uploadFileToS3(fileBuffer, fileName, folder, mimetype) {
    const key = getS3Key(fileName, folder);

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
        ACL: 'public-read',
    });

    await s3Client.send(command);
    return getS3PublicUrl(key);
}

// supprimer un fichier S3 a partir de son url publique
async function deleteFileFromS3(fileUrl) {
    if (!fileUrl) return false;

    try {
        // extraire la cle depuis l url : https://endpoint/bucket/key
        const url = new URL(fileUrl);
        // le pathname commence par /bucket/key
        const key = url.pathname.replace(`/${BUCKET}/`, '');

        const command = new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: key,
        });

        await s3Client.send(command);
        return true;
    } catch (error) {
        console.error('erreur deleteFileFromS3:', error.message);
        return false;
    }
}

export { generateFileName, getS3Key, getS3PublicUrl, uploadFileToS3, deleteFileFromS3 };
