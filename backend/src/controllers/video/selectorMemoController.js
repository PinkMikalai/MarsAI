//ici mes imports

const { 
    createSelectorMemoModel, 
    getAllSelectorMemosModel, 
    getSelectorMemoByIdModel, 
    updateSelectorMemoModel, 
    deleteSelectorMemoModel, 
    deleteMemosByVideoIdModel, 
    getVideoMemoStatsModel 
} = require("../../models/video/selectorMemoModel.js");


//=====================================================
// SELECTOR MEMO - CRUD
//=====================================================

//create selector memo par selector
async function createSelectorMemo(req, res) {
    console.log("test createSelectorMemo");
    try {
        const { rating, comment, video_id, user_id, selection_status_id } = req.body;
        const selectorMemo = await createSelectorMemoModel(rating, comment, video_id, user_id, selection_status_id);
        res.status(201).json({
            data: selectorMemo,
            message: "Mémo de sélection créé avec succès",
            status: true
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la création du mémo de sélection",
            error: error.message,
            status: false
        });
    }
}


// ici les memos d un selector par son id
async function getSelectorMemosById(req, res) {
    console.log("test getSelectorMemosById");
}

module.exports = {
    createSelectorMemo,
    getSelectorMemosById,
};