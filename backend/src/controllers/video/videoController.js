//import de nos models (reqs SQL)
const {
    createVideoModel, 
    getAllVideosModel,
    getVideoByIdModel,
    getAdminVideoDataByIdModel,
    getSelectorVideoDataByIdModel,
    updateVideoModel, 
    deleteVideoModel
} = require("../../models/video/videoModel.js");

//import de nos services 
const checkRole = require("../../middlewares/checkRoleMiddleware.js");
const { 
    createAndLinkTagsService, 
    updateTagsService, 
    getVideoTagsService 
} = require("../../services/video/tagService.js");
const { 
    getStillsByVideoIdModel, 
    updateStillsByVideoIdModel, 
} = require("../../models/video/stillModel.js");
const { 
    
    getContributorsByVideoIdModel,
} = require("../../models/video/contributorModel.js");
const { 
    getAwardsByVideoIdModel, 
} = require("../../models/video/awardModel.js");
const { getMemosByVideoIdModel } = require("../../models/video/selectorMemoModel.js");
//=====================================================
// VIDEO - CRUD
//=====================================================


//create video
async function createVideo(req, res) {
    console.log("test creation de video");
    
    
}


// get all videos
async function getAllVideos(req, res) {
    
    //ici notre logique de recuperation de toutes les videos avec leurs infos

    try {
        const videos = await getAllVideosModel();
        //ici console log pour cmder pour verifier si les videos et autres infos sont ete bien recuperee
        console.log("videos", videos);
        


        res.status(200).json({
            success: true,
            data: videos,
            message: "Videos recuperées avec succès",
        })
    } catch (error) {   
        res.status(500).json({
            success: false,
            data: [],
            message: "Erreur lors de la recuperation de toutes les videos",
            error: error.message,
        });
    }
}

// get video by id avec TOUTES les infos (tags, stills, contributors, awards, memos)
async function getVideoById(req, res) {


    try {
        //recuperer la video avec TOUTES ses infos d'un coup
        const basicVideoData = await getVideoByIdModel(req.params.id);
      
        
        const selectorVideoData =   await getSelectorVideoDataByIdModel(req.params.id);
       
        //l affichage des donnees pour le selector
        const adminVideoData =   await getAdminVideoDataByIdModel(req.params.id);
 
        // si le video n est pas trouvee affiche l erreur
        if (!basicVideoData) {

            console.log("Video non trouvée, 404");
            return res.status(404).json({
                message: "Video non trouvée",
                status: false
            });
        }else{
            console.log("basic video data", basicVideoData);
            console.log("admin video data", adminVideoData);
            res.status(200).json({
                message: "Video recuperée avec succès",
                data: {
                    basicVideoData,
                    adminVideoData,
                },
                status: true,
            });
        }
    } catch (error) {
        console.error("Erreur getVideoById:", error);
        res.status(500).json({
            message: error.message,
            status: false
        });
    }
}

// update video
async function updateVideo(req, res) {
    console.log("test updateVideo");

    try {
        // separation des tags de mon video et autres infos sur notre video
        const { tags, stills, ...videoData } = req.body;
        console.log("tags fournis", tags);
        console.log("stills fournis", stills);
        
        //autres infos sur notre video
        console.log("donnees video", videoData);
        
        //mettre a jour la video (table video uniquement)
        const updated = await updateVideoModel(req.params.id, videoData);
        console.log("updated", updated);
        
        //mettre a jour les tags dans video_tag si fournis
        let updatedTags = [];
        if (tags && Array.isArray(tags)) {
            updatedTags = await updateTagsService(req.params.id, tags);
            console.log("tags mis a jour", updatedTags);
        }
        
        //mettre a jour les stills dans still si fournis
        let updatedStills = [];
        if (stills && Array.isArray(stills)) {
            updatedStills = await updateStillsByVideoIdModel(req.params.id, stills);
            console.log("stills mis a jour", updatedStills);
        }
        
        //recuperer la video mise a jour
        const video = await getVideoByIdModel(req.params.id);
        console.log("video", video);
        
        //recuperer tous les tags de la video depuis video_tag
        const videoTags = await getVideoTagsService(req.params.id);
        console.log("tous les tags de la video", videoTags);
        
        res.status(200).json({
            message: "Video mise à jour avec succès",
            video: video,
            tags: videoTags,
            status: "success"
        });
        
    } catch (error) {
        console.error("Erreur updateVideo:", error);
        res.status(500).json({
            message: error.message,
            status: "error"
        });
    }
}

// delete video
async function deleteVideo(req, res) {
    console.log("test deleteVideo");

    //ici notour logique de suppression d une video
}
module.exports = {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
}