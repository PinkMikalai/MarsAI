import { 
    createSponsorModel, 
    getAllSponsorsModel, 
    getSponsorByIdModel, 
    updateSponsorModel, 
    deleteSponsorModel 
} from "../models/sponsorModel.js";
import { deleteOldFile } from "../services/deleteFileService.js";

async function createSponsor(req, res) {
    console.log("test create sponsor");
    
    try {
        console.log("req.body:", req.body);
        console.log("req.files:", req.files);

        if (req.files && req.files.img) {
            req.body.img = req.files.img[0].filename;
            console.log("fichier image uploade:", req.body.img);
        }

        const insertId = await createSponsorModel(req.body);
        console.log("sponsor cree, id:", insertId);

        if (insertId) {
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
    const sponsors = await getAllSponsorsModel();
    
    if (!sponsors) {
        return res.status(404).json({
            message: "Aucun sponsor trouvé",
            status: false,
        });
    }
    try {
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
    const sponsor = await getSponsorByIdModel(req.params.id);
    try {
        console.log(sponsor);
        if (!sponsor) {
            console.log("Sponsor non trouvé");
            return res.status(404).json({
                message: "Sponsor non trouvé",
                status: false
            });
        }
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

async function updateSponsor(req, res) {
    try {
        const existingSponsor = await getSponsorByIdModel(req.params.id);
        if (!existingSponsor) {
            console.log("Sponsor non trouvé");
            return res.status(404).json({
                message: "Sponsor non trouvé",
                status: false
            });
        }

        const oldImageFileName = existingSponsor.img;
        console.log("ancien fichier:", oldImageFileName);

        if (req.files && req.files.img) {
            req.body.img = req.files.img[0].filename;
            console.log("nouveau fichier image uploadé:", req.body.img);
        }

        const result = await updateSponsorModel(req.params.id, req.body);
        console.log("result", result);

        if (result) {
            if (req.files && req.files.img && oldImageFileName) {
                deleteOldFile(oldImageFileName, 'images');
            }
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
        const existingSponsor = await getSponsorByIdModel(req.params.id);
        if (!existingSponsor) {
            console.log("Sponsor non trouvé");
            return res.status(404).json({
                message: "Sponsor non trouvé",
                status: false
            });
        }

        const imageFileName = existingSponsor.img;
        console.log("nom de l'image:", imageFileName);

        const result = await deleteSponsorModel(req.params.id);
        console.log("result", result);

        deleteOldFile(imageFileName, 'images');

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

export {
    createSponsor,
    getAllSponsors,
    getSponsorById,
    updateSponsor,
    deleteSponsor,
};
