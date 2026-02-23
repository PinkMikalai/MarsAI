import { searchVideosModel } from '../models/video/videoModel.js';

async function searchVideos(req, res) {
    try {
        const searchQuery = req.query.q?.trim();

        if (!searchQuery) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Veuillez saisir un mot clé à rechercher",
            });
        }

        const role = req.user?.role;
        const userId = req.user?.id;

        const rows = await searchVideosModel(searchQuery, { role, userId });
        // map les videos
        const videos = rows.map((row) => row.video_json);

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
