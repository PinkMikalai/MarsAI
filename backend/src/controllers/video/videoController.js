import {
    createVideoModel, 
    getSearchVideosModel,
    getVideoByIdModel,
    getAdminVideoDataByIdModel,
    getSelectorVideoDataByIdModel,
    updateVideoModel, 
    deleteVideoModel,
} from "../../models/video/videoModel.js";
import { 
    createAndLinkTagsService, 
    updateTagsService, 
    getVideoTagsService 
} from "../../services/video/tagService.js";
import {
    updateStillsByVideoIdModel,
} from "../../models/video/stillModel.js";
import { deleteYouTubeVideo } from "../../services/video/youtubeService.js";
import { getFullVideoDetailsModel } from "../../models/video/videoModel.js";
import { getAssignmentByUserModel } from "../../models/admin/assignementModel.js";


//=====================================================
// VIDEO - CRUD
//=====================================================

async function createVideo(req, res) {
}

async function getSearchVideos(req, res) {
    try {
        const videos = await getSearchVideosModel(req.query);
        res.status(200).json({
            success: true,
            data: videos,
            message: "Videos recuperées avec succès",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            message: "Erreur lors de la recuperation des videos",
            error: error.message,
        });
    }
}

async function getVideoById(req, res) {
    try {
        const role_id = req.user?.role_id;

        const basicVideoData = await getVideoByIdModel(req.params.id);

        if (!basicVideoData) {
            return res.status(404).json({
                message: "Video non trouvée",
                status: false
            });
        }

        else if (role_id === 1 || role_id === 3) {

            const adminVideoData = await getAdminVideoDataByIdModel(req.params.id);
            return res.status(200).json({
                message: "Video recuperée avec succès",
                data: {
                    basicVideoData: basicVideoData,
                    adminVideoData: adminVideoData,
                },
                status: true,
            });
        }
        else if (role_id === 2) {
            const selectorVideoData = await getSelectorVideoDataByIdModel(req.params.id, req.user?.id);

            const hasMemo = selectorVideoData[0]?.video_json?.selector_memo?.id !== null;

            return res.status(200).json({
                message: "Video recuperée avec succès",
                memo_status: hasMemo ? "Vous avez déjà noté cette vidéo" : "Vous n'avez pas encore noté cette vidéo",
                data: {
                    basicVideoData: basicVideoData,
                    selectorVideoData: selectorVideoData,
                },
                status: true,
            });
        }
        else {
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

    try {
        const { tags, stills, ...videoData } = req.body;
        
        const updated = await updateVideoModel(req.params.id, videoData);
        
        let updatedTags = [];
        if (tags && Array.isArray(tags)) {
            updatedTags = await updateTagsService(req.params.id, tags);
        }
        
        let updatedStills = [];
        if (stills && Array.isArray(stills)) {
            updatedStills = await updateStillsByVideoIdModel(req.params.id, stills);
        }
        
        const video = await getVideoByIdModel(req.params.id);
        
        const videoTags = await getVideoTagsService(req.params.id);
        
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
    try {
        const id = parseInt(req.params.id, 10);
        if (!id) return res.status(400).json({ message: "ID invalide" });

        const video = await getFullVideoDetailsModel(id);
        if (!video) return res.status(404).json({ message: "Participation introuvable" });

        // Suppression YouTube (non bloquant)
        if (video.youtube_url) {
            try {
                await deleteYouTubeVideo(video.youtube_url);
            } catch (ytErr) {
            }
        }

        await deleteVideoModel(id);
        res.status(200).json({ success: true, message: "Participation supprimée avec succès" });
    } catch (error) {
        console.error("Erreur deleteVideo:", error.message);
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
}


export {
    createVideo,
    getSearchVideos,
    getVideoById,
    updateVideo,
    deleteVideo
   
};
