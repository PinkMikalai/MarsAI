import * as videoModel from '../models/video/videoModel.js';
import * as contributorModel from '../models/video/contributorModel.js';
import * as stillModel from '../models/video/stillModel.js';
import * as tagModel from '../models/video/tagModel.js';
import { uploadToYouTube, updateYouTubeVideo } from '../services/video/youtubeService.js';
import { getVideoMetada } from '../services/video/metadataService.js';
import { deleteFileFromS3 } from '../services/uploadService.js';
import { UPLOAD_BASE } from '../middlewares/uploadMiddleware.js';
import { confirmParticipationEmail, sendParticipationEditEmail } from '../services/admin/mailService.js';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { getInvitationByJtiModel, markInvitationAsUsedModel } from '../models/admin/invitationModel.js';
import { createParticipationEditToken } from '../services/user/authService.js';


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
                await tagModel.linkTagsToVideo(newVideoId, tagIds);
            }
        }


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
            

        } catch (emailError) {
            console.error("Failure to send confirmation email", emailError.message)
        }

        res.status(201).json({
            message: "Participation enregistrée et vidéo uploadée avec succès",
            videoId: newVideoId,
            title_en: validatedData.title_en || validatedData.title,
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
};

const getParticipationDetails = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.purpose !== 'video_edit') {
            return res.status(403).json({ message: "Jeton invalide pour cet usage" });
        }

        const invitation = await getInvitationByJtiModel(decoded.jti);
        if (!invitation || invitation.status !== 'pending') {
            return res.status(401).json({ message: "Ce lien a déjà été utilisé ou a expiré" });
        }

        const videoData = await videoModel.getFullVideoDetailsModel(decoded.videoId);

        res.status(200).json({
            success: true,
            video: videoData
        });
    } catch (error) {
        res.status(401).json({ message: "Lien invalide ou expiré" });
    }
};

const sendEditInvitation = async (req, res) => {
    try {
        const videoId = parseInt(req.params.id, 10);
        const video = await videoModel.getFullVideoDetailsModel(videoId);
        if (!video) {
            return res.status(404).json({ message: "Vidéo introuvable" });
        }

        const token = await createParticipationEditToken({ videoId, email: video.email });
        await sendParticipationEditEmail(video.email, token, video.title_en);

        res.status(200).json({ success: true, message: "Invitation d'édition envoyée" });
    } catch (error) {
        console.error("Erreur sendEditInvitation:", error.message);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'invitation" });
    }
};

const updateParticipation = async (req, res) => {
    let tempCoverPath = null;
    let tempSrtPath = null;

    try {
        const { token, ...bodyData } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token manquant" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.purpose !== 'video_edit') {
            return res.status(403).json({ message: "Jeton invalide pour cet usage" });
        }

        const invitation = await getInvitationByJtiModel(decoded.jti);
        if (!invitation || invitation.status !== 'pending') {
            return res.status(401).json({ message: "Ce lien a déjà été utilisé ou a expiré" });
        }

        const videoId = decoded.videoId;
        const validatedData = bodyData;

        // Mise à jour des champs principaux de la vidéo (sans video_file_name, youtube_url, duration)
        const videoUpdateData = {};
        const editableFields = [
            'title', 'title_en', 'synopsis', 'synopsis_en', 'tech_resume', 'creative_resume',
            'language', 'country', 'classification', 'email',
            'realisator_firstname', 'realisator_lastname', 'realisator_civility',
            'birthdate', 'mobile_number', 'phone_number', 'address', 'social_media_links_json',
            'acquisition_source_id'
        ];
        for (const field of editableFields) {
            if (validatedData[field] !== undefined) {
                videoUpdateData[field] = validatedData[field];
            }
        }

        // Gestion de la cover (fichier optionnel)
        const coverFile = req.files?.['cover']?.[0] || null;
        if (coverFile) {
            videoUpdateData.cover = coverFile.s3Url || coverFile.generatedName;
            tempCoverPath = path.join(UPLOAD_BASE, 'images', coverFile.generatedName);
            if (coverFile.buffer) fs.writeFileSync(tempCoverPath, coverFile.buffer);
        }

        // Gestion du SRT (fichier optionnel)
        const srtFile = req.files?.['srt_file_name']?.[0] || null;
        if (srtFile) {
            videoUpdateData.srt_file_name = srtFile.s3Url || srtFile.generatedName;
            tempSrtPath = path.join(UPLOAD_BASE, 'srt', srtFile.generatedName);
            if (srtFile.buffer) fs.writeFileSync(tempSrtPath, srtFile.buffer);
        }

        await videoModel.updateVideoModel(videoId, videoUpdateData);

        // Mise à jour des contributors
        if (validatedData.contributor !== undefined) {
            let contributors = [];
            try {
                contributors = typeof validatedData.contributor === 'string'
                    ? JSON.parse(validatedData.contributor)
                    : validatedData.contributor;
            } catch (_) {}
            await contributorModel.deleteContributorsByVideoIdModel(videoId);
            if (contributors.length > 0) {
                await contributorModel.createContributorsModel(contributors, videoId);
            }
        }

        // Mise à jour des stills (seulement si de nouveaux fichiers ont été uploadés)
        if (req.files?.['still'] && req.files['still'].length > 0 && validatedData.still?.length > 0) {
            await stillModel.deleteStillsByVideoIdModel(videoId);
            await stillModel.createStillsModel(validatedData.still, videoId);
        }

        // Mise à jour des tags
        if (validatedData.tag !== undefined) {
            await tagModel.unlinkTagsFromVideo(videoId);
            const tagNames = validatedData.tag.map(t => t.name);
            const allTags = await tagModel.createTagModel(tagNames);
            if (allTags?.length > 0) {
                await tagModel.linkTagsToVideo(videoId, allTags.map(t => t.id));
            }
        }

        // Mise à jour YouTube (métadonnées + thumbnail + SRT si fournis)
        try {
            const updatedVideo = await videoModel.getFullVideoDetailsModel(videoId);
            if (updatedVideo?.youtube_url) {
                const youtubeTitle = updatedVideo.title
                    ? `${updatedVideo.title} || ${updatedVideo.title_en}`
                    : updatedVideo.title_en;
                const youtubeDescription = `SYNOPSIS (EN) : ${updatedVideo.synopsis_en || 'N/A'}\nSYNOPSIS (Original) : ${updatedVideo.synopsis || 'N/A'}\n---\nDIRECTED BY : ${updatedVideo.realisator_firstname} ${updatedVideo.realisator_lastname}`;
                await updateYouTubeVideo(
                    updatedVideo.youtube_url,
                    youtubeTitle,
                    youtubeDescription,
                    coverFile ? `images/${coverFile.generatedName}` : null,
                    srtFile ? `srt/${srtFile.generatedName}` : null
                );
            }
        } catch (ytErr) {
        }

        cleanupTempFiles(tempCoverPath, tempSrtPath);

        // Marquer l'invitation comme utilisée (usage unique)
        await markInvitationAsUsedModel(decoded.jti);

        res.status(200).json({ success: true, message: "Participation mise à jour avec succès" });
    } catch (error) {
        cleanupTempFiles(tempCoverPath, tempSrtPath);
        console.error("Erreur updateParticipation:", error.message);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Lien invalide ou expiré" });
        }
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
    }
};

export {
    addParticipation,
    getParticipationDetails,
    sendEditInvitation,
    updateParticipation
};
