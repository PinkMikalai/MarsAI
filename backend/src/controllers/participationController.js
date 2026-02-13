const videoModel = require('../models/video/videoModel.js');
const contributorModel = require('../models/video/contributorModel.js');
const stillModel = require('../models/video/stillModel.js');
const tagModel = require('../models/video/tagModel.js'); 
const { uploadToYouTube } = require('../services/video/youtubeService.js');

const { getVideoMetada } = require('../services/video/metadataService.js'); 
const { UPLOAD_BASE } = require('../middlewares/uploadMiddleware.js'); 
const path  = require('path'); 
const fs = require('fs'); 


async function addParticipation(req, res) {
    console.log("je teste ma route addParticipation");
    // const test = req.body;  // teste du schéma zod 
    // console.log(test);

    try {
        const validatedData = req.body; 
        
        // PARTIE 1 : ANALYSE TECHNIQUE DE LA VIDEO (RATIO ET DUREE)

        const videoFileName = req.files['video_file_name'] ? req.files['video_file_name'][0].filename : null; 
        // vérification de la présence de la vidéo 
        if(!videoFileName) {
            throw new Error ("Fichier vidéo introuvable dans la requête");
        }

        // Chemin complet pour ffprobe
        const fullVideoPath = path.join(UPLOAD_BASE, 'videos', videoFileName); 

        // Appel du metadataService
        const meta = await getVideoMetada(fullVideoPath); 

        // validation du format 16/9
        if(!meta.is169) {
            // Sécurité : suppression du mauvais fichier du serveur 
            if (fs.existsSync(fullVideoPath)) fs.unlinkSync(fullVideoPath);

            return res.status(400).json({
                message: `Format invalide : ${meta.width}*${meta.height}.cLe format 16/9 est obligatoire.`
            });
        }

        // validation de la durée (max 3 min = 180 secondes)
        if (meta.duration > 180) {
            if (fs.existsSync(fullVideoPath)) fs.unlinkSync(fullVideoPath); 
            return res.status(400).json({
                message: `Vidéo trop longue : ${meta.duration} secondes. La durée maximale autorisée est de 3 minutes (180s).`
            });
        }
        // injection de la durée réelle dans la BDD
        validatedData.duration = meta.duration

        // PARTIE 2 : ENREGISTREMENT EN BASE DE DONNEES 

        // étape 1 : Insertion de la video en base de données 
        // on appelle la fonction dans videoModel, l'id retourné par le model sera stocké dans newVideoId
        const newVideoId = await videoModel.createVideoModel(validatedData); 
        // on vérifie si MySql a bien enregistré un ID 
        console.log("id de la video crée : ", newVideoId);
        if(!newVideoId) {
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
        // étape 2 : insertion des contributeurs
        if (contributorsToSave && contributorsToSave.length > 0) {
            // console.log("tentative d'insertion des contributeurs");
            // on appelle le modèle en lui passant : le tableau des contributeurs et l'id de la video que l'on veut créer
            await contributorModel.createContributorsModel(contributorsToSave, newVideoId);
            // console.log("étape 3 : succès (contributeurs liés)");
        }

        // étape 3 : insertion des stills 
        if (validatedData.still && validatedData.still.length > 0) {
            // console.log("tentative d'insertion des stills");
            // on appelle le modèle des stills 
            await stillModel.createStillsModel(validatedData.still, newVideoId); 
            // console.log("étape 3 : succès (images liées)");        
        }

        // étape 4 : gestion des tags 
        if (validatedData.tag && validatedData.tag.length > 0 ) {
            // console.log("tentative de gestion des tags");
            // on extrait juste les noms pour la fonction createTagModel 
            const tagNames = validatedData.tag.map(t => t.name);  // on extrait les noms 
            const allTags = await tagModel.createTagModel(tagNames);  // on crée/récupère les tags
            if (allTags && allTags.length > 0) {
                // on extrait les IDs de ces tags pour les lier à la video 
                const tagIds = allTags.map(t => t.id); // on extrait les IDs
                console.log("succès tags liés");
                await tagModel.linkTagsToVideo(newVideoId, tagIds); // on crée les liens 
            }
        }

        // PARTIE 3 : PREPARATION ET UPLOAD VERS YOUTUBE 
        console.log("Préparation de la description Youtube..");

        // Le titre du film (en langue originale et anglais ou juste anglais) 
        const youtubeDisplayTitle = validatedData.title 
            ? `${validatedData.title} || ${validatedData.title_en}`
            : validatedData.title_en;

        // TAGS 
        const hashtags = validatedData.tag 
            ? validatedData.tag.map(t => {
                // Sécurité : on vérifie que t.name existe, sinon on prend une chaîne vide
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


        // PARTIE 4 : UPLOAD VERS YOUTUBE
        console.log('Démarrage de lupload Youtube');

        // const videoFileName = req.files['video_file_name'] ? req.files['video_file_name'][0].filename : null; 
        const cover = req.files['cover'] ? req.files['cover'][0].filename : null; 
        const srt_file_name = req.files['srt_file_name'] ? req.files['srt_file_name'][0].filename : null; 

        if(!videoFileName) {
            throw new Error("Le fichier vidéo est manquant dans la requête"); 
        }

        const youtubeResult = await uploadToYouTube(
            `videos/${videoFileName}`, 
            youtubeDisplayTitle, 
            fullDescription, 
            cover ? `images/${cover}` : null,
            srt_file_name ? `srt/${srt_file_name}` : null
        ); 

        // PARTIE 5 : MISE A JOUR SQL AVEC YOUTUBE 

        // construction de l'url youtube à partir de l'id reçu
        const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeResult.id}`;

        // on appelle la requête (modèle) pour mettre à jour la colonne youtube_url
        await videoModel.updateYoutubeId(newVideoId, youtubeResult.id)
        
        res.status(201).json({
            message: "Participation enregistrée et vidéo uploadée avec succès", 
            videoId: newVideoId,
            youtubeUrl: youtubeUrl, 
            detectedDuration: meta.duration,
            resolution: `${meta.width}x${meta.height}`
        })
        

    } catch(error) {
        // on précise où ça a planté 
        console.error("Erreur lors de addParticipation :", error.message);
        res.status(500).json({
            message: "Une erreur est survenue lors de l'enregistrement",
            error: error.message 
        })
    }
}

module.exports = {
    addParticipation
}