// SPONSOR - CONTROLLER

//ici mes imports 
const { createSponsorModel, 
        getAllSponsorsModel, 
        getSponsorByIdModel, 
        updateSponsorModel, 
        deleteSponsorModel 
} = require("../models/sponsorModel.js");


//nos fonctions controllers

async function createSponsor(req, res) {
    console.log("test d create sponsor");

}

async function getAllSponsors(req, res) {


    //on recupere les sponsors
    const sponsors = await getAllSponsorsModel();

    //si les sponsors n sont pas trouvés affiche ca
    
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
            status: "error",
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

        //mettre a jour le sponsor
        const result = await updateSponsorModel(req.params.id, req.body);
        console.log("result", result);

        //verifier si la mise a jour a reussi
        if (result) {
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
}   



module.exports = {
    createSponsor,
    getAllSponsors,
    getSponsorById,
    updateSponsor,
    deleteSponsor,
}