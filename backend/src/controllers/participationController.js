const videoModel = require('../models/video/videoModel.js');
const contributorModel = require('../models/video/contributorModel.js');
const stillModel = require('../models/video/stillModel.js');
const tagModel = require('../models/video/tagModel.js'); 


async function addParticipation(req, res) {
    console.log("je teste ma route addParticipation");
    // const test = req.body;  // teste du schéma zod 
    // console.log(test);

    try {
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
            }
            await tagModel.linkTagsToVideo(newVideoId, tagIds); // on crée les liens 
        }
        
        
        res.status(201).json({
            message: "participation enregistrée avec succès", 
            videoId: newVideoId
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