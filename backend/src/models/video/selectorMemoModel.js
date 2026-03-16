import { pool } from "../../db/index.js";

// Créer un mémo de sélection
async function createSelectorMemoModel(memoData) {
    const [result] = await pool.execute(
        'INSERT INTO selector_memo (rating, comment, video_id, user_id, selection_status_id) VALUES (?, ?, ?, ?, ?)',
        [memoData.rating, memoData.comment, memoData.video_id, memoData.user_id, memoData.selection_status_id]
    );
    return result.insertId;
}

// Récupérer tous les mémos de sélection
async function getAllSelectorMemosModel() {
    const [rows] = await pool.execute(
        'SELECT * FROM selector_memo'
    );
    return rows;
}

// Récupérer un mémo par ID
async function getSelectorMemoByIdModel(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM selector_memo WHERE id = ?',
        [id]
    );
    return rows[0];
}

// Récupérer les mémos d'une vidéo
async function getMemosByVideoIdModel(videoId) {
    const [rows] = await pool.execute(
        `SELECT selector_memo.*, 
                user.firstname, user.lastname, user.email,
                selection_status.name as status_name
         FROM selector_memo
         LEFT JOIN user ON selector_memo.user_id = user.id
         LEFT JOIN selection_status ON selector_memo.selection_status_id = selection_status.id
         WHERE selector_memo.video_id = ?`,
        [videoId]
    );
    return rows;
}

// Récupérer les mémos d'un sélecteur (user)
async function getMemosByUserIdModel(userId) {
    const [rows] = await pool.execute(
        `SELECT selector_memo.*, 
                video.title, video.title_en,
                selection_status.name as status_name
         FROM selector_memo
         LEFT JOIN video ON selector_memo.video_id = video.id
         LEFT JOIN selection_status ON selector_memo.selection_status_id = selection_status.id
         WHERE selector_memo.user_id = ?`,
        [userId]
    );
    return rows;
}

// Récupérer un mémo spécifique d'un user pour une vidéo
async function getMemoByUserAndVideoModel(userId, videoId) {
    const [rows] = await pool.execute(
        `SELECT selector_memo.*, 
                selection_status.name as status_name
         FROM selector_memo
         LEFT JOIN selection_status ON selector_memo.selection_status_id = selection_status.id
         WHERE selector_memo.user_id = ? AND selector_memo.video_id = ?`,
        [userId, videoId]
    );
    return rows[0];
}

// Mettre à jour un mémo de sélection (mise à jour partielle)
async function updateSelectorMemoModel(id, memoData) {
    const existing = await getSelectorMemoByIdModel(id);
    if (!existing) return false;

    const rating = memoData.rating !== undefined ? memoData.rating : existing.rating;
    const comment = memoData.comment !== undefined ? memoData.comment : existing.comment;
    const selection_status_id = memoData.selection_status_id !== undefined ? memoData.selection_status_id : existing.selection_status_id;

    const [result] = await pool.execute(
        'UPDATE selector_memo SET rating = ?, comment = ?, selection_status_id = ? WHERE id = ?',
        [rating ?? null, comment ?? null, selection_status_id ?? null, id]
    );
    return result.affectedRows > 0;
}

// Supprimer un mémo de sélection
async function deleteSelectorMemoModel(id) {
    const [result] = await pool.execute(
        'DELETE FROM selector_memo WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

// Supprimer tous les mémos d'une vidéo
async function deleteMemosByVideoIdModel(videoId) {
    const [result] = await pool.execute(
        'DELETE FROM selector_memo WHERE video_id = ?',
        [videoId]
    );
    return result.affectedRows > 0;
}

// Récupérer les statistiques des mémos pour une vidéo (moyenne des notes, nombre de mémos, etc.)
async function getVideoMemoStatsModel(videoId) {
    const [rows] = await pool.execute(
        `SELECT 
            COUNT(*) as total_memos,
            AVG(rating) as average_rating,
            MIN(rating) as min_rating,
            MAX(rating) as max_rating
         FROM selector_memo
         WHERE video_id = ? AND rating IS NOT NULL`,
        [videoId]
    );
    return rows[0];
}
// recuperer les la liste des videos assignées au selectionneur
async function getVideoForSelectorModel(userId) {
    const [rows] = await pool.execute(
        `SELECT 
            video.*, 
            assignation.assignate_at, 
            selector_memo.id as memo_id, -- Utile pour savoir si un mémo existe déjà
            selector_memo.selection_status_id,
            selector_memo.rating,
            selector_memo.comment as selector_comment
         FROM video
         INNER JOIN assignation ON video.id = assignation.video_id
         LEFT JOIN selector_memo ON (video.id = selector_memo.video_id AND selector_memo.user_id = ?)
         WHERE assignation.user_id = ?`,
        [userId, userId]
    );
    return rows;
}


export {
    createSelectorMemoModel,
    getAllSelectorMemosModel,
    getSelectorMemoByIdModel,
    getMemosByVideoIdModel,
    getMemosByUserIdModel,
    getMemoByUserAndVideoModel,
    updateSelectorMemoModel,
    deleteSelectorMemoModel,
    deleteMemosByVideoIdModel,
    getVideoMemoStatsModel,
    getVideoForSelectorModel
}
