import { 
    createJuryModel, 
    getAllJuryModel, 
    getJuryByIdModel, 
    updateJuryModel, 
    deleteJuryModel 
} from "../models/juryModel.js";
import { deleteOldFile } from "../services/deleteFileService.js";

async function createJury(req, res) {
    console.log("test create jury");
    
    try {
        console.log("req.body:", req.body);
        console.log("req.files:", req.files);

        if (req.files && req.files.illustration) {
            req.body.illustration = req.files.illustration[0].filename;
            console.log("fichier illustration uploade:", req.body.illustration);
        }

        const insertId = await createJuryModel(req.body);
        console.log("jury cree, id:", insertId);

        if (insertId) {
            const newJury = await getJuryByIdModel(insertId);
            console.log("jury recupere:", newJury);

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
    console.log("test get all jury");

    try {
        const jurys = await getAllJuryModel();
        console.log("jurys recuperes:", jurys);

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
    console.log("test get jury by id");
    console.log("id:", req.params.id);

    try {
        const jury = await getJuryByIdModel(req.params.id);
        console.log("jury recupere:", jury);

        if (!jury) {
            console.log("jury non trouve");
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
    console.log("test update jury");
    console.log("id:", req.params.id);

    try {
        console.log("req.body:", req.body);
        console.log("req.files:", req.files);

        const existingJury = await getJuryByIdModel(req.params.id);
        if (!existingJury) {
            console.log("jury non trouve");
            return res.status(404).json({
                message: "jury non trouve",
                status: false
            });
        }   

        const oldIllustrationFileName = existingJury.illustration;
        console.log("ancien fichier:", oldIllustrationFileName);

        if (req.files && req.files.illustration) {
            req.body.illustration = req.files.illustration[0].filename;
            console.log("nouveau fichier illustration uploade:", req.body.illustration);
        }

        const result = await updateJuryModel(req.params.id, req.body);
        console.log("result:", result);

        if (result) {
            if (req.files && req.files.illustration && oldIllustrationFileName) {
                deleteOldFile(oldIllustrationFileName, 'images');
            }

            const updatedJury = await getJuryByIdModel(req.params.id);
            console.log("jury mis a jour:", updatedJury);

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
    console.log("test delete jury");
    console.log("id:", req.params.id);

    try {
        const existingJury = await getJuryByIdModel(req.params.id);
        if (!existingJury) {
            console.log("jury non trouve");
            return res.status(404).json({
                message: "jury non trouve",
                status: false
            }); 
        }

        const illustrationFileName = existingJury.illustration;
        console.log("nom de l illustration:", illustrationFileName);

        const result = await deleteJuryModel(req.params.id);
        console.log("result:", result);

        if (result) {
            if (illustrationFileName) {
                deleteOldFile(illustrationFileName, 'images');
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
