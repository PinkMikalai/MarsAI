import {
    getAllAwardsModel,
    getAwardsByVideoIdModel,
    unlinkAwardsFromVideo,
    linkAwardsToVideo,
    getWinnerVideosModel,
} from '../../models/video/awardModel.js';

// GET /awards — tous les prix disponibles
async function getAllAwardsController(req, res, next) {
    try {
        const awards = await getAllAwardsModel();
        res.status(200).json({ success: true, data: awards });
    } catch (error) {
        next(error);
    }
}

// GET /videos/:id/awards — prix d'une vidéo
async function getVideoAwardsController(req, res, next) {
    try {
        const { id } = req.params;
        const awards = await getAwardsByVideoIdModel(id);
        res.status(200).json({ success: true, data: awards });
    } catch (error) {
        next(error);
    }
}

// POST /videos/:id/awards — remplace tous les prix d'une vidéo
// body: { awardIds: [1, 2, ...] }
async function setVideoAwardsController(req, res, next) {
    try {
        const { id } = req.params;
        const { awardIds = [] } = req.body;
        await unlinkAwardsFromVideo(id);
        if (awardIds.length > 0) {
            await linkAwardsToVideo(id, awardIds);
        }
        const updated = await getAwardsByVideoIdModel(id);
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
}

// GET /videos/winners — vidéos primées pour la home
async function getWinnersController(req, res, next) {
    try {
        const winners = await getWinnerVideosModel();
        res.status(200).json({ success: true, data: winners });
    } catch (error) {
        next(error);
    }
}

export {
    getAllAwardsController,
    getVideoAwardsController,
    setVideoAwardsController,
    getWinnersController,
};
