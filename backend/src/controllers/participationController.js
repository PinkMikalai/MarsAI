import * as videoModel from '../models/video/videoModel.js';
import * as contributorModel from '../models/video/contributorModel.js';
import * as stillModel from '../models/video/stillModel.js';
import * as tagModel from '../models/video/tagModel.js';
import { uploadToYouTube } from '../services/video/youtubeService.js';
import { getVideoMetada } from '../services/video/metadataService.js';
import { deleteFileFromS3 } from '../services/uploadService.js';
import { UPLOAD_BASE } from '../middlewares/uploadMiddleware.js';
import { confirmParticipationEmail } from '../services/admin/mailService.js';
import path from 'path';
import fs from 'fs';

// nettoyage : supprimer tous les fichiers S3 deja uploades en cas d erreur
async function cleanupS3Files(req) {
    if (!req.files) return;
    for (const files of Object.values(req.files)) {
        for (const file of files) {
            if (file.s3Url) await deleteFileFromS3(file.s3Url);
        }
    }
}

// nettoyage : supprimer les fichiers temporaires locaux
function cleanupTempFiles(...paths) {
    for (const p of paths) {
        if (p && fs.existsSync(p)) fs.unlinkSync(p);
    }
}

async function addParticipation(req, res) {
    console.log("je teste ma route addParticipation");

    let tempVideoPath = null;
    let tempCoverPath = null;
    let tempSrtPath = null;

    try {
        const validatedData = req.body;

        // recuperer le fichier video depuis multer (buffer en memoire)
        const videoFile = req.files['video_file_name'] ? req.files['video_file_name'][0] : null;
        if (!videoFile) {
            throw new Error("Fichier vidéo introuvable dans la requête");
        }

        // ecrire le buffer video dans un fichier temporaire pour ffmpeg + youtube
        tempVideoPath = path.join(UPLOAD_BASE, 'videos', videoFile.generatedName);
        fs.writeFileSync(tempVideoPath, videoFile.buffer);

        const meta = await getVideoMetada(tempVideoPath);

        if (!meta.is169) {
            cleanupTempFiles(tempVideoPath);
            await cleanupS3Files(req);
            return res.status(400).json({
                message: `Format invalide : ${meta.width}*${meta.height}.cLe format 16/9 est obligatoire.`
            });
        }

        if (meta.duration > 180) {
            cleanupTempFiles(tempVideoPath);
            await cleanupS3Files(req);
            return res.status(400).json({
                message: `Vidéo trop longue : ${meta.duration} secondes. La durée maximale autorisée est de 3 minutes (180s).`
            });
        }
        validatedData.duration = meta.duration;

        const newVideoId = await videoModel.createVideoModel(validatedData);
        console.log("id de la video crée : ", newVideoId);
        if (!newVideoId) {
            return res.status(400).json({
                message: "L'insertion de la video a échoué"
            })
        }

        let contributorsToSave = [];
        try {
            if (typeof validatedData.contributor === 'string') {
                contributorsToSave = JSON.parse(validatedData.contributor);
            } else {
                contributorsToSave = validatedData.contributor || [];
            }
        } catch (error) {
            return res.status(400).json({
                message: "Contributors format is invalid"
            });
        }
        if (contributorsToSave && contributorsToSave.length > 0) {
            await contributorModel.createContributorsModel(contributorsToSave, newVideoId);
        }

        if (validatedData.still && validatedData.still.length > 0) {
            await stillModel.createStillsModel(validatedData.still, newVideoId);
        }

        if (validatedData.tag && validatedData.tag.length > 0) {
            const tagNames = validatedData.tag.map(t => t.name);
            const allTags = await tagModel.createTagModel(tagNames);
            if (allTags && allTags.length > 0) {
                const tagIds = allTags.map(t => t.id);
                console.log("succès tags liés");
                await tagModel.linkTagsToVideo(newVideoId, tagIds);
            }
        }

        console.log("Préparation de la description Youtube..");

        const youtubeDisplayTitle = validatedData.title
            ? `${validatedData.title} || ${validatedData.title_en}`
            : validatedData.title_en;

        const hashtags = validatedData.tag
            ? validatedData.tag.map(t => {
                const tagName = t.name || "";
                return `#${tagName.replace(/\s+/g, '')}`;
            }).join(' ')
            : '';

        const fullDescription = `     
            SYNOPSIS (EN) : ${validatedData.synopsis_en || 'N/A'}
            SYNOPSIS (Original) : ${validatedData.synopsis || 'N/A'}
            ---
            DIRECTED BY : ${validatedData.realisator_firstname} ${validatedData.realisator_lastname}
            COUNTRY : ${validatedData.country}
            ${hashtags}
        `

        console.log('Démarrage de lupload Youtube');

        // ecrire cover et srt en fichiers temporaires pour youtube
        const coverFile = req.files['cover'] ? req.files['cover'][0] : null;
        const srtFile = req.files['srt_file_name'] ? req.files['srt_file_name'][0] : null;

        if (coverFile) {
            tempCoverPath = path.join(UPLOAD_BASE, 'images', coverFile.generatedName);
            fs.writeFileSync(tempCoverPath, coverFile.buffer);
        }

        if (srtFile) {
            tempSrtPath = path.join(UPLOAD_BASE, 'srt', srtFile.generatedName);
            fs.writeFileSync(tempSrtPath, srtFile.buffer);
        }

        const youtubeResult = await uploadToYouTube(
            `videos/${videoFile.generatedName}`,
            youtubeDisplayTitle,
            fullDescription,
            coverFile ? `images/${coverFile.generatedName}` : null,
            srtFile ? `srt/${srtFile.generatedName}` : null
        );

        // nettoyage des fichiers temporaires apres youtube
        cleanupTempFiles(tempVideoPath, tempCoverPath, tempSrtPath);

        const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeResult.id}`;
        await videoModel.updateYoutubeId(newVideoId, youtubeResult.id);

        try {
            const candidateEmail = validatedData.email
            if (candidateEmail) {
                await confirmParticipationEmail(candidateEmail, {
                    title_en: validatedData.title_en || validatedData.title,
                    realisator_firstname: validatedData.realisator_firstname,
                    realisator_lastname: validatedData.realisator_lastname
                })

            } 
            console.log("Confirmation participation email send successfully");
            

        } catch (emailError) {
            console.error("Failure to send confirmation email", emailError.message)
        }

        res.status(201).json({
            message: "Participation enregistrée et vidéo uploadée avec succès",
            videoId: newVideoId,
            youtubeUrl: youtubeUrl,
            detectedDuration: meta.duration,
            resolution: `${meta.width}x${meta.height}`
        })

    } catch (error) {
        cleanupTempFiles(tempVideoPath, tempCoverPath, tempSrtPath);
        console.error("Erreur lors de addParticipation :", error.message);
        res.status(500).json({
            message: "Une erreur est survenue lors de l'enregistrement",
            error: error.message
        })
    }
}

export { addParticipation };
