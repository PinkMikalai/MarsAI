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


// verification de la rple d utilisateur
const checkRole = require("../../middlewares/checkRoleMiddleware.js");
//=====================================================
// SELECTOR MEMO - CRUD
//=====================================================

//create selector memo par selector
async function createSelectorMemo(req, res) {
    console.log("test createSelectorMemo");
}


// ici les memos d un selector par son id
async function getSelectorMemosById(req, res) {
    console.log("test getSelectorMemosById");
}

module.exports = {
    createSelectorMemo,
    getSelectorMemosById,
};