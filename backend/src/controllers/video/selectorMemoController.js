import { 
    createSelectorMemoModel, 
    getAllSelectorMemosModel, 
    getSelectorMemoByIdModel, 
    updateSelectorMemoModel, 
    deleteSelectorMemoModel, 
    deleteMemosByVideoIdModel, 
    getVideoMemoStatsModel 
} from "../../models/video/selectorMemoModel.js";

//=====================================================
// SELECTOR MEMO - CRUD
//=====================================================

async function createSelectorMemo(req, res) {
    try {
        const { rating, comment, video_id, user_id, selection_status_id } = req.body;
        const selectorMemo = await createSelectorMemoModel({rating, comment, video_id, user_id, selection_status_id});
        if (selectorMemo) {
            res.status(400).json({
                message: "Vous ne pouvez pas noter cette video deux fois",
                status: false
            });
        }
        else {
            res.status(201).json({
                data: selectorMemo,
                message: "Votre note a ete bien prise en compte",
                status: true
            });
        }
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la prise en compte de votre note",
            error: error.message,
            status: false
        });
    }
}

async function updateSelectorMemo(req, res) {
    try {
        const { rating, comment, video_id, user_id, selection_status_id } = req.body;
        const selectorMemo = await updateSelectorMemoModel({rating, comment, video_id, user_id, selection_status_id});
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la mise a jour de votre note",
            error: error.message,
            status: false
        });
    }
}

async function getSelectorMemosById(req, res) {
    console.log("test getSelectorMemosById");
}

export {
    createSelectorMemo,
    updateSelectorMemo,
    getSelectorMemosById,
};
