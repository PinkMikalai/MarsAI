import { 
    createSelectorMemoModel, 
    getAllSelectorMemosModel, 
    getSelectorMemoByIdModel, 
    updateSelectorMemoModel, 
    deleteSelectorMemoModel, 
    getMemosByUserIdModel,
    getMemoByUserAndVideoModel
} from "../../models/video/selectorMemoModel.js";

//=====================================================
// SELECTOR MEMO - CRUD
//=====================================================

// Créer un memo (un selector note une vidéo)
async function createSelectorMemo(req, res) {
    try {
        // Récupération sécurisée depuis les sources fiables
        const video_id = req.params.id; 
        const user_id = req.user.id;      
        const { rating, comment, selection_status_id } = req.body;
   
        
        // Vérifier si ce selector a déjà un memo pour cette vidéo
        const userMemo = await getMemoByUserAndVideoModel(user_id, video_id);
        
        if (userMemo) {
            return res.status(400).json({
                message: "Vous ne pouvez pas noter cette video deux fois",
                status: false
            });
        }
        
        // Si pas de memo existant, créer le nouveau memo
        const memoId = await createSelectorMemoModel({
            rating, 
            comment, 
            video_id, 
            user_id, 
            selection_status_id
        });
        
        if (memoId) {
            // recuperer le memo creer
            const newMemo = await getSelectorMemoByIdModel(memoId);

            
            res.status(201).json({
                message: "Votre note a ete bien prise en compte",
                memo: newMemo,
                status: true
            });
        } else {
            res.status(400).json({
                message: "erreur lors de la creation du memo",
                status: false
            });
        }
    } catch (error) {
        console.error("erreur createSelectorMemo:", error);
        res.status(500).json({ 
            message: "Erreur lors de la prise en compte de votre note",
            status: false,
            error: error.message
        });
    }
}

// Récupérer tous les memos
async function getAllSelectorMemos(req, res) {
    try {
        const memos = await getAllSelectorMemosModel();
        console.log("memos recuperes:", memos);
        
        res.status(200).json({
            message: "memos recuperes avec succes",
            memos: memos,
            status: true
        });
    } catch (error) {
        console.error("erreur getAllSelectorMemos:", error);
        res.status(500).json({
            message: "erreur lors de la recuperation des memos",
            status: false,
            error: error.message
        });
    }
}


//recuperer touts les notes d un tilisateur consernee
async function getSelectorAllMemoByUserId(req, res){

    const memos = await getMemosByUserIdModel(req.user.id);
    if (!memos) {
        return res.status(404).json({
            message: "Aucune note a ete fait par le Selector",
            status: false
        });
    }
        res.status(200).json({
        message: "memos recuperes avec succes",
        memos: memos,
        status: true    
    });
}
// Récupérer un memo par son ID
async function getSelectorMemoById(req, res) {
    console.log("id:", req.params.id);
    
    try {
        const memo = await getSelectorMemoByIdModel(req.params.id);
        console.log("memo recupere:", memo);
        
        if (!memo) {
            console.log("memo non trouve");
            return res.status(404).json({
                message: "memo non trouve",
                status: false
            });
        }
        
        res.status(200).json({
            message: "memo recupere avec succes",
            memo: memo,
            status: true
        });
    } catch (error) {
        console.error("erreur getSelectorMemoById:", error);
        res.status(500).json({
            message: "erreur lors de la recuperation du memo",
            status: false,
            error: error.message
        });
    }
}

// Mettre à jour un memo
async function updateSelectorMemo(req, res) {
    console.log("id:", req.params.id);
    
    try {
        console.log("req.body:", req.body);
        
        // Vérifier si le memo existe
        const existingMemo = await getSelectorMemoByIdModel(req.params.id);
        if (!existingMemo) {
            console.log("memo non trouve");
            return res.status(404).json({
                message: "memo non trouve",
                status: false
            });
        }
        
        // Vérifier que c'est bien le propriétaire du memo qui le modifie
        if (existingMemo.user_id !== req.user.id) {
            console.log("tentative de modification du memo d'un autre selector");
            return res.status(403).json({
                message: "Vous ne pouvez modifier que vos propres notes",
                status: false
            });
        }
        
        // Mettre à jour le memo
        const result = await updateSelectorMemoModel(req.params.id, req.body);
        console.log("result:", result);
        
        if (result) {
            const updatedMemo = await getSelectorMemoByIdModel(req.params.id);
            console.log("memo mis a jour:", updatedMemo);
            
            res.status(200).json({
                message: "memo mis a jour avec succes",
                memo: updatedMemo,
                status: true
            });
        } else {
            res.status(400).json({
                message: "aucune modification effectuee",
                status: false
            });
        }
    } catch (error) {
        console.error("erreur updateSelectorMemo:", error);
        res.status(500).json({
            message: "erreur lors de la mise a jour du memo",
            status: false,
            error: error.message
        });
    }
}

// Supprimer un memo
async function deleteSelectorMemo(req, res) {
    console.log("id:", req.params.id);
    
    try {
        // Vérifier si le memo existe
        const existingMemo = await getSelectorMemoByIdModel(req.params.id);
        if (!existingMemo) {
            console.log("memo non trouve");
            return res.status(404).json({
                message: "memo non trouve",
                status: false
            });
        }
        
        // Vérifier que c'est bien le propriétaire du memo qui le supprime
        if (existingMemo.user_id !== req.user.id) {
            console.log("tentative de suppression du memo d'un autre selector");
            return res.status(403).json({
                message: "Vous ne pouvez supprimer que vos propres notes",
                status: false
            });
        }
        
        // Supprimer le memo
        const result = await deleteSelectorMemoModel(req.params.id);
        console.log("result:", result);
        
        if (result) {
            res.status(200).json({
                message: "memo supprime avec succes",
                status: true
            });
        } else {
            res.status(400).json({
                message: "aucune suppression effectuee",
                status: false
            });
        }
    } catch (error) {
        console.error("erreur deleteSelectorMemo:", error);
        res.status(500).json({
            message: "erreur lors de la suppression du memo",
            status: false,
            error: error.message
        });
    }
}

export {
    createSelectorMemo,
    getAllSelectorMemos,
    getSelectorAllMemoByUserId,
    getSelectorMemoById,
    updateSelectorMemo,
    deleteSelectorMemo,
};
