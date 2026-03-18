import { 
    createJuryModel, 
    getAllJuryModel, 
    getJuryByIdModel, 
    updateJuryModel, 
    deleteJuryModel 
} from "../models/juryModel.js";
import { deleteOldFile } from "../services/deleteFileService.js";

async function createJury(req, res) {
    
    try {

        if (req.files && req.files.illustration) {
            req.body.illustration = req.files.illustration[0].filename;
        }

        const insertId = await createJuryModel(req.body);

        if (insertId) {
            const newJury = await getJuryByIdModel(insertId);

            res.status(200).json({
                message: "jury cree avec succes",   
                jury: newJury,
                status: true
            });
        } else {
            res.status(400).json({
                message: "erreur lors de la creation",
                status: false
            });
        }
    } catch (error) {
        console.error("erreur createJury:", error);
        res.status(500).json({
            message: "erreur lors de la creation du jury",              
            status: false,
            error: error.message
        });
    }
}

async function getAllJury(req, res) {

    try {
        const jurys = await getAllJuryModel();

        res.status(200).json({
            message: "jurys recuperes avec succes",
            jurys: jurys,
            status: true
        });
    } catch (error) {       
        console.error("erreur getAllJury:", error);
        res.status(500).json({
            message: "erreur lors de la recuperation des jurys",
            status: false,
            error: error.message
        });
    }
}   

async function getJuryById(req, res) {

    try {
        const jury = await getJuryByIdModel(req.params.id);

        if (!jury) {
            return res.status(404).json({
                message: "jury non trouve",
                status: false
            });
        }

        res.status(200).json({
            message: "jury recupere avec succes",
            jury: jury,
            status: true
        });
    } catch (error) {
        console.error("erreur getJuryById:", error);
        res.status(500).json({
            message: "erreur lors de la recuperation du jury",  
            status: false,
            error: error.message
        });
    }
}

async function updateJury(req, res) {

    try {

        const existingJury = await getJuryByIdModel(req.params.id);
        if (!existingJury) {
            return res.status(404).json({
                message: "jury non trouve",
                status: false
            });
        }   

        const oldIllustrationFileName = existingJury.illustration;

        if (req.files && req.files.illustration) {
            req.body.illustration = req.files.illustration[0].filename;
        }

        const result = await updateJuryModel(req.params.id, req.body);

        if (result) {
            if (req.files && req.files.illustration && oldIllustrationFileName) {
                await deleteOldFile(oldIllustrationFileName, 'images');
            }

            const updatedJury = await getJuryByIdModel(req.params.id);

            res.status(200).json({
                message: "jury mis a jour avec succes",
                jury: updatedJury,
                status: true
            });
        } else {
            res.status(400).json({
                message: "aucune modification effectuee",
                status: false
            });
        }
    } catch (error) {
        console.error("erreur updateJury:", error);
        res.status(500).json({
            message: "erreur lors de la mise a jour du jury",
            status: false,
            error: error.message
        });
    }
}

async function deleteJury(req, res) {

    try {
        const existingJury = await getJuryByIdModel(req.params.id);
        if (!existingJury) {
            return res.status(404).json({
                message: "jury non trouve",
                status: false
            }); 
        }

        const illustrationFileName = existingJury.illustration;

        const result = await deleteJuryModel(req.params.id);

        if (result) {
            if (illustrationFileName) {
                await deleteOldFile(illustrationFileName, 'images');
            }

            res.status(200).json({
                message: "jury supprime avec succes",
                status: true
            });
        } else {
            res.status(400).json({
                message: "aucune suppression effectuee",
                status: false
            });
        }
    } catch (error) {
        console.error("erreur deleteJury:", error);
        res.status(500).json({
            message: "erreur lors de la suppression du jury",
            status: false,
            error: error.message
        });
    }
}

export {  
    createJury,
    getAllJury,
    getJuryById,
    updateJury,
    deleteJury,
};
