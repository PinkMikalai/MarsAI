import { getSearchVideosModel } from '../models/video/videoModel.js';

async function searchVideos(req, res) {
    try {
     


        const videos = await getSearchVideosModel(req.query);

        res.status(200).json({
            success: true,
            data: videos,
            message: "Recherche effectuée avec succès",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            message: "Erreur lors de la recherche des videos",
            error: error.message,
        });
    }
}

export { searchVideos };
