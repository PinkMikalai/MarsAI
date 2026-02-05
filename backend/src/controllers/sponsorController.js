// SPONSOR - CONTROLLER

//ici mes imports 
const { createSponsorModel, 
        getAllSponsorsModel, 
        getSponsorByIdModel, 
        updateSponsorModel, 
        deleteSponsorModel 
} = require("../models/sponsorModel.js");


//import du service de suppression d'ancien fichier
const { deleteOldFile } = require("../services/deleteFileService.js");

//nos fonctions controllers

async function createSponsor(req, res) {
    console.log("test create sponsor");
    
    try {
        console.log("req.body:", req.body);
        console.log("req.files:", req.files);

        // si un fichier image a ete uploade, on recupere son nom
        if (req.files && req.files.img) {
            req.body.img = req.files.img[0].filename;
            console.log("fichier image uploade:", req.body.img);
        }

        //creer le sponsor
        const insertId = await createSponsorModel(req.body);
        console.log("sponsor cree, id:", insertId);

        //verifier si la creation a reussi
        if (insertId) {
            //recuperer le sponsor cree
            const newSponsor = await getSponsorByIdModel(insertId);
            console.log("sponsor recupere:", newSponsor);

            res.status(200).json({
                message: "sponsor cree avec succes",
                sponsor: newSponsor,
                status: true
            });
        } else {
            res.status(400).json({
                message: "erreur lors de la creation",
                status: false
            });
        }
    } catch (error) {
        console.error("Erreur createSponsor:", error);
        res.status(500).json({
            message: "Erreur lors de la création du sponsor",
            status: false,
            error: error.message
        });
    }
}

async function getAllSponsors(req, res) {


    //on recupere les sponsors
    const sponsors = await getAllSponsorsModel();

    //si les sponsors n sont pas trouvés affiche ca
    
    if (!sponsors) {
        return res.status(404).json({
            message: "Aucun sponsor trouvé",
            status: false,
        });
    }
    try {
        //on renvoie les sponsors
        console.log(sponsors);
        res.status(200).json({
            message: "Sponsors récupérés avec succès",
            sponsors: sponsors,
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des sponsors",
            status: false,
            error: error.message
        });
    }
}

async function getSponsorById(req, res) {
   
    
    //on recupere le sponsor par id
    const sponsor = await getSponsorByIdModel(req.params.id);
    try {
        //on renvoie le sponsor
        console.log(sponsor);

        //si l id de sponsor n est pas trouvé on renvoie une erreur
        if (!sponsor) {
            console.log("Sponsor non trouvé");
            return res.status(404).json({
                message: "Sponsor non trouvé",
                status: false
            });
        }
        //si non tu envoi les infos du sponsor
        else {
            res.status(200).json({
                message: "Sponsor récupéré avec succès",
                sponsor: sponsor,
                status: true
            });
        }
        
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération du sponsor",
            status: false,
            error: error.message
        });
    }
}

// update d un sponsor par son id
async function updateSponsor(req, res) {
   
    try {

        //verifier si le sponsor existe
        const existingSponsor = await getSponsorByIdModel(req.params.id);
        if (!existingSponsor) {
            console.log("Sponsor non trouvé");
            return res.status(404).json({
                message: "Sponsor non trouvé",
                status: false
            });
        }

        // sauvegarder l'ancien nom de fichier avant la mise a jour
        const oldImageFileName = existingSponsor.img;
        console.log("ancien fichier:", oldImageFileName);

        // si un fichier image a ete uploade, on recupere son nom
        // le middleware validate.js a deja mis le filename dans req.body.img
        if (req.files && req.files.img) {
            req.body.img = req.files.img[0].filename;
            console.log("nouveau fichier image uploadé:", req.body.img);
        }

        //mettre a jour le sponsor
        const result = await updateSponsorModel(req.params.id, req.body);
        console.log("result", result);

        //verifier si la mise a jour a reussi
        if (result) {
            // si un nouveau fichier a ete uploade et qu'il y avait un ancien fichier
            // on supprime l'ancien fichier du serveur via le service
            if (req.files && req.files.img && oldImageFileName) {
                deleteOldFile(oldImageFileName, 'images');
            }

            //recuperer le sponsor mis a jour
            const updatedSponsor = await getSponsorByIdModel(req.params.id);
            
            res.status(200).json({
                message: "Sponsor mis à jour avec succès",
                sponsor: updatedSponsor,
                status: true
            });
        } else {
            res.status(400).json({
                message: "Aucune modification effectuée",
                status: false
            });
        }

    } catch (error) {
        console.error("Erreur updateSponsor:", error);
        res.status(500).json({
            message: "Erreur lors de la mise à jour du sponsor",
            status: false,
            error: error.message
        });
    }
}

async function deleteSponsor(req, res) {
    
    console.log("test d delete sponsor");

    try {
        //verifier si le sponsor existe
        const existingSponsor = await getSponsorByIdModel(req.params.id);
        if (!existingSponsor) {
            console.log("Sponsor non trouvé");
            return res.status(404).json({
                message: "Sponsor non trouvé",
                status: false
            });
        }

        //recuperation du nom de l'image du sponsor
        const imageFileName = existingSponsor.img;
        console.log("nom de l'image:", imageFileName);

        //supprimer le sponsor
        const result = await deleteSponsorModel(req.params.id);
        console.log("result", result);

        //supprimer l'image du sponsor
        deleteOldFile(imageFileName, 'images'); // via le service


        //verifier si la suppression a reussi
        if (result) {
            res.status(200).json({
                message: "Sponsor supprimé avec succès",
                status: true
            });
        } else {
            res.status(400).json({
                message: "Aucune suppression effectuée",
                status: false
            });
        }

    } catch (error) {
        console.error("Erreur deleteSponsor:", error);
        res.status(500).json({
            message: "Erreur lors de la suppression du sponsor",
            status: false,
            error: error.message
        });
    }
}   



module.exports = {
    createSponsor,
    getAllSponsors,
    getSponsorById,
    updateSponsor,
    deleteSponsor,
}
