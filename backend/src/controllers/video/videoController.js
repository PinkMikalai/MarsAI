import {
    createVideoModel, 
    getAllVideosModel,
    getVideoByIdModel,
    getAdminVideoDataByIdModel,
    getSelectorVideoDataByIdModel,
    updateVideoModel, 
    deleteVideoModel
} from "../../models/video/videoModel.js";
import { 
    createAndLinkTagsService, 
    updateTagsService, 
    getVideoTagsService 
} from "../../services/video/tagService.js";
import { 
    updateStillsByVideoIdModel, 
} from "../../models/video/stillModel.js";


//=====================================================
// VIDEO - CRUD
//=====================================================

async function createVideo(req, res) {
    console.log("test creation de video");
}

async function getAllVideos(req, res) {
    try {
        const videos = await getAllVideosModel();
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

async function getVideoById(req, res) {
    try {
        let role = req.user?.role;
        
        const basicVideoData = await getVideoByIdModel(req.params.id);
 
        if (!basicVideoData) {
            return res.status(404).json({
                message: "Video non trouvée",
                status: false
            });
        }
        else if (role === "Admin" || role === "Super-admin") {
            const adminVideoData = await getAdminVideoDataByIdModel(req.params.id);
            console.log("admin video data", adminVideoData);
            return res.status(200).json({
                message: "Video recuperée avec succès",
                data: {
                    basicVideoData: basicVideoData,
                    adminVideoData: adminVideoData,
                },
                status: true,
            });
        }
        else if (role === "Selector") {
            const selectorVideoData = await getSelectorVideoDataByIdModel(req.params.id, req.user?.id);
            console.log("selector video data", selectorVideoData);
            return res.status(200).json({
                message: "Video recuperée avec succès",
                data: {
                    basicVideoData: basicVideoData,
                    selectorVideoData: selectorVideoData,
                },
                status: true,
            });
        }
        else {
            console.log("basic video data", basicVideoData);
            return res.status(200).json({
                message: "Video recuperée avec succès",
                data: basicVideoData,
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

async function updateVideo(req, res) {
    console.log("test updateVideo");

    try {
        const { tags, stills, ...videoData } = req.body;
        console.log("tags fournis", tags);
        console.log("stills fournis", stills);
        console.log("donnees video", videoData);
        
        const updated = await updateVideoModel(req.params.id, videoData);
        console.log("updated", updated);
        
        let updatedTags = [];
        if (tags && Array.isArray(tags)) {
            updatedTags = await updateTagsService(req.params.id, tags);
            console.log("tags mis a jour", updatedTags);
        }
        
        let updatedStills = [];
        if (stills && Array.isArray(stills)) {
            updatedStills = await updateStillsByVideoIdModel(req.params.id, stills);
            console.log("stills mis a jour", updatedStills);
        }
        
        const video = await getVideoByIdModel(req.params.id);
        console.log("video", video);
        
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

async function deleteVideo(req, res) {
    console.log("test deleteVideo");
}

export {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
};
