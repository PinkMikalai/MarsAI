const videoModel = require('../models/video/videoModel.js');
const contributorModel = require('../models/video/contributorModel.js');
const stillModel = require('../models/video/stillModel.js');
const tagModel = require('../models/video/tagModel.js'); 
const { uploadToYouTube } = require('../services/video/youtubeService.js');


async function addParticipation(req, res) {
    console.log("je teste ma route addParticipation");
    // const test = req.body;  // teste du schéma zod 
    // console.log(test);

    try {
        // PARTIE 1 : ENREGISTREMENT EN BASE DE DONNEES

        // c'est ici que zod dépose les données propres après validation 
        const validatedData = req.body; 

        // étape 1 
        // console.log("Titre :", validatedData.title);
        // console.log("Nombre de contributeurs :", validatedData.contributor?.length);
        // console.log("Nombre de stills :", validatedData.still?.length);

        // étape 2 : Insertion de la video 
        // on appelle la fonction dans videoModel, l'id retourné par le model sera stocké dans newVideoId
        const newVideoId = await videoModel.createVideoModel(validatedData); 
        // on vérifie si MySql a bien enregistré un ID 
        console.log("id de la video crée : ", newVideoId);
        if(!newVideoId) {
            return res.status(400).json({
                message: "L'insertion de la video a échoué"
            })
        }

        // étape 3 : insertion des contributeurs
        if (validatedData.contributor && validatedData.contributor.length > 0) {
            console.log("tentative d'insertion des contributeurs");
            // on appelle le modèle en lui passant : le tableau des contributeurs et l'id de la video que l'on veut créer
            await contributorModel.createContributorsModel(validatedData.contributor, newVideoId);
            console.log("étape 3 : succès (contributeurs liés)");
        }

        // étape 4 : insertion des stills 
        if (validatedData.still && validatedData.still.length > 0) {
            console.log("tentative d'insertion des stills");
            // on appelle le modèle des stills 
            await stillModel.createStillsModel(validatedData.still, newVideoId); 
            console.log("étape 4 : succès (images liées)");        
        }

        // étape 5 : gestion des tags 
        if (validatedData.tag && validatedData.tag.length > 0 ) {
            console.log("tentative de gestion des tags");
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

        // PARTIE 2 : PREPARATION ET UPLOAD VERS YOUTUBE 
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


        // PARTIE 3 : UPLOAD VERS YOUTUBE
        console.log('Démarrage de lupload Youtube');

        const videoFileName = req.files['video_file_name'] ? req.files['video_file_name'][0].filename : null; 
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

        // PARTIE 4 : MISE A JOUR SQL AVEC YOUTUBE 

        await videoModel.updateYoutubeId(newVideoId,youtubeResult.id)
        
        res.status(201).json({
            message: "participation enregistrée avec succès", 
            videoId: newVideoId,
            youtubeId: youtubeResult.id
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