//import de nos models (reqs SQL)
const {
    createVideoModel, 
    getAllVideosModel,
    getVideoByIdModel,
    updateVideoModel, 
    deleteVideoModel
} = require("../../models/video/videoModel.js");

//import de nos services (logique métier)
const { createAndLinkTagsService, updateTagsService, getVideoTagsService } = require("../../services/video/tagService.js");


//=====================================================
// VIDEO - CRUD
//=====================================================


//create video
async function createVideo(req, res) {
    console.log("test creation de video");
    
    
}


// get all videos
async function getAllVideos(req, res) {
    
    //ici notre logique de recuperation de toutes les videos

    try {
        const videos = await getAllVideosModel();
        //ici console log pour cmder pour verifier si les videos sont bien recuperées
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

// get video by id
async function getVideoById(req, res) {
    console.log("test getVideoById");

    try {
        //recuperer la video
        const video = await getVideoByIdModel(req.params.id);
        console.log("video", video);
        
        //recuperer les tags de la video depuis video_tag
        const tags = await getVideoTagsService(req.params.id);
        console.log("tags de la video", tags);
        
        res.status(200).json({
            message: "Video recuperée avec succès",
            video: video,
            tags: tags,
            status: "success"
        });
        
    } catch (error) {
        console.error("Erreur getVideoById:", error);
        res.status(500).json({
            message: error.message,
            status: "error"
        });
    }
}

// update video
async function updateVideo(req, res) {
    console.log("test updateVideo");

    try {
        // separation des tags de mon video et autres infos sur notre video
        const { tags, ...videoData } = req.body;
        console.log("tags fournis", tags);
        
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