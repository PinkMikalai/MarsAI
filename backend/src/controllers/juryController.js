// JURY - CONTROLLER

const { 
    createJuryModel, 
    getAllJuryModel, 
    getJuryByIdModel, 
    updateJuryModel, 
    deleteJuryModel 
} = require("../models/juryModel.js");

const { deleteOldFile } = require("../services/deleteFileService.js");

// nos fonctions controllers

async function createJury(req, res) {
    console.log("test create jury");
    
    try {
        console.log("req.body:", req.body);
        console.log("req.files:", req.files);

        // si un fichier illustration a ete uploade, on recupere son nom
        if (req.files && req.files.illustration) {
            req.body.illustration = req.files.illustration[0].filename;
            console.log("fichier illustration uploade:", req.body.illustration);
        }

        //creer le jury
        const insertId = await createJuryModel(req.body);
        console.log("jury cree, id:", insertId);

        //verifier si la creation a reussi
        if (insertId) {
            //recuperer le jury cree
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
        //recuperer tous les jurys
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
        //recuperer le jury par id
        const jury = await getJuryByIdModel(req.params.id);
        console.log("jury recupere:", jury);

        //si le jury n est pas trouve
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

        //verifier si le jury existe
        const existingJury = await getJuryByIdModel(req.params.id);
        if (!existingJury) {
            console.log("jury non trouve");
            return res.status(404).json({
                message: "jury non trouve",
                status: false
            });
        }   

        // sauvegarder l'ancien nom de fichier avant la mise a jour
        const oldIllustrationFileName = existingJury.illustration;
        console.log("ancien fichier:", oldIllustrationFileName);

        // si un fichier illustration a ete uploade, on recupere son nom
        if (req.files && req.files.illustration) {
            req.body.illustration = req.files.illustration[0].filename;
            console.log("nouveau fichier illustration uploade:", req.body.illustration);
        }

        //mettre a jour le jury
        const result = await updateJuryModel(req.params.id, req.body);
        console.log("result:", result);

        //verifier si la mise a jour a reussi
        if (result) {
            // si un nouveau fichier a ete uploade et qu'il y avait un ancien fichier
            // on supprime l'ancien fichier du serveur via le service
            if (req.files && req.files.illustration && oldIllustrationFileName) {
                deleteOldFile(oldIllustrationFileName, 'images');
            }

            //recuperer le jury mis a jour
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
        //verifier si le jury existe
        const existingJury = await getJuryByIdModel(req.params.id);
        if (!existingJury) {
            console.log("jury non trouve");
            return res.status(404).json({
                message: "jury non trouve",
                status: false
            }); 
        }

        //recuperation du nom de l illustration du jury
        const illustrationFileName = existingJury.illustration;
        console.log("nom de l illustration:", illustrationFileName);

        //supprimer le jury de la bdd
        const result = await deleteJuryModel(req.params.id);
        console.log("result:", result);

        //verifier si la suppression a reussi
        if (result) {
            //supprimer l illustration du jury du serveur
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
module.exports = {  
    createJury,
    getAllJury,
    getJuryById,
    updateJury,
    deleteJury,
}