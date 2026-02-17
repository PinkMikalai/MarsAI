import * as videoModel from '../models/video/videoModel.js';
import * as contributorModel from '../models/video/contributorModel.js';
import * as stillModel from '../models/video/stillModel.js';
import * as tagModel from '../models/video/tagModel.js'; 
import { uploadToYouTube } from '../services/video/youtubeService.js';
import { getVideoMetada } from '../services/video/metadataService.js'; 
import { UPLOAD_BASE } from '../middlewares/uploadMiddleware.js'; 
import path from 'path'; 
import fs from 'fs'; 

async function addParticipation(req, res) {
    console.log("je teste ma route addParticipation");

    try {
        const validatedData = req.body; 
        
        const videoFileName = req.files['video_file_name'] ? req.files['video_file_name'][0].filename : null; 
        if (!videoFileName) {
            throw new Error("Fichier vidéo introuvable dans la requête");
        }

        const fullVideoPath = path.join(UPLOAD_BASE, 'videos', videoFileName); 
        const meta = await getVideoMetada(fullVideoPath); 

        if (!meta.is169) {
            if (fs.existsSync(fullVideoPath)) fs.unlinkSync(fullVideoPath);
            return res.status(400).json({
                message: `Format invalide : ${meta.width}*${meta.height}.cLe format 16/9 est obligatoire.`
            });
        }

        if (meta.duration > 180) {
            if (fs.existsSync(fullVideoPath)) fs.unlinkSync(fullVideoPath); 
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

        const cover = req.files['cover'] ? req.files['cover'][0].filename : null; 
        const srt_file_name = req.files['srt_file_name'] ? req.files['srt_file_name'][0].filename : null; 

        if (!videoFileName) {
            throw new Error("Le fichier vidéo est manquant dans la requête"); 
        }

        const youtubeResult = await uploadToYouTube(
            `videos/${videoFileName}`, 
            youtubeDisplayTitle, 
            fullDescription, 
            cover ? `images/${cover}` : null,
            srt_file_name ? `srt/${srt_file_name}` : null
        ); 

        const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeResult.id}`;
        await videoModel.updateYoutubeId(newVideoId, youtubeResult.id);
        
        res.status(201).json({
            message: "Participation enregistrée et vidéo uploadée avec succès", 
            videoId: newVideoId,
            youtubeUrl: youtubeUrl, 
            detectedDuration: meta.duration,
            resolution: `${meta.width}x${meta.height}`
        })

    } catch (error) {
        console.error("Erreur lors de addParticipation :", error.message);
        res.status(500).json({
            message: "Une erreur est survenue lors de l'enregistrement",
            error: error.message 
        })
    }
}

export { addParticipation };
