//import de nos models (reqs SQL)
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
        // Récupérer le rôle de l'utilisateur s'il est connecté (sinon role = undefined)
        const role = req.user?.role;
        
        // Recuperer la video avec TOUTES ses infos
        const basicVideoData = await getVideoByIdModel(req.params.id);
 
        // Si la video n'est pas trouvée, afficher l'erreur
        if (!basicVideoData || !basicVideoData[0]) {
            return res.status(404).json({
                message: "Video non trouvée",
                status: false
            });
        }
        
        // Si l'utilisateur est Admin ou Super-admin → données complètes admin
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
        // Si l'utilisateur est Selector → données selector
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
        // Sinon (pas de rôle ou rôle non reconnu) → données basiques uniquement
        else {
            console.log("basic video data", basicVideoData);
            return res.status(200).json({
                message: "Video recuperée avec succès",
                data: basicVideoData[0],
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
export {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
};