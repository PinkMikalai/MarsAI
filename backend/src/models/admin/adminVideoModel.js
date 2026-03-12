import { pool } from "../../db/index.js";

// Créer un administration video pour les admins
async function createAdminVideoModel(adminVideoData) {
    const [result] = await pool.execute(
        'INSERT INTO admin_video (comment, video_id, user_id, admin_status_id) VALUES (?, ?, ?, ?)',
        [ adminVideoData.comment, adminVideoData.video_id, adminVideoData.user_id, adminVideoData.admin_status_id]
    );
    return result.insertId;
}

// Récupérer tous les admin_videos
async function getAllAdminVideoModel() {
    const [rows] = await pool.execute(
        'SELECT * FROM admin_video'
    );
    return rows;
}

// Récupérer un admin_video par son ID
async function getAdminVideoByIdModel(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM admin_video WHERE id = ?',
        [id]
    );
    return rows[0];
}

// Récupérer les admin_video par video
async function getAdminVideoByVideoIdModel(videoId) {
    const [rows] = await pool.execute(
        `SELECT admin_video.*, 
                user.id, user.firstname, user.lastname,
                admin_status.name as status_name
         FROM admin_video
         LEFT JOIN user ON admin_video.user_id = user.id
         LEFT JOIN admin_status ON admin_video.admin_status_id = admin_status.id
         WHERE admin_video.video_id = ?`,
        [videoId]
    );
    return rows;
}

//Récupérer les admin_video pour un user
async function getAdminVideoByUserIdModel(userId) {
    const [rows] = await pool.execute(
        `SELECT admin_video.*, 
                video.id, video.title, video.title_en,
                admin_status.name as status_name
         FROM admin_video
         LEFT JOIN video ON admin_video.video_id = video.id
         LEFT JOIN admin_status ON admin_video.admin_status_id = admin_status.id
         WHERE admin_video.user_id = ?`,
        [userId]
    );
    return rows;
}

// Récupérer un mémo spécifique d'un user pour une vidéo
async function getAdminVideoByUserIdAndVideoIdModel(userId, videoId) {
    const [rows] = await pool.execute(
        `SELECT admin_video.*, 
                admin_status.name as status_name
         FROM admin_video
        LEFT JOIN admin_status ON admin_video.admin_status_id = admin_status.id
         WHERE admin_video.user_id = ? AND admin_video.video_id = ?`,
        [userId, videoId]
    );
    return rows[0];
}

// Actualisation d'un admin_video
async function updateAdminVideoModel(id, adminVideoData) {
    const existing = await getAdminVideoByIdModel(id);
    if (!existing) return false;

    const comment = adminVideoData.comment !== undefined ? adminVideoData.comment : existing.comment;
    const admin_status_id = adminVideoData.admin_status_id !== undefined ? adminVideoData.admin_status_id : existing.admin_status_id;

    const [result] = await pool.execute(
        'UPDATE admin_video SET comment = ?, admin_status_id = ? WHERE id = ?',
        [ comment ?? null, admin_status_id ?? null, id]
    );
    return result.affectedRows > 0;
}

// Supprimer un admin_video 
async function deleteAdminVideoByIdModel(id) {
    const [result] = await pool.execute(
        'DELETE FROM admin_video WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

// Supprimer tous les admin_videos d'une video
async function deleteVideoAdminByVideoIdModel(videoId) {
    const [result] = await pool.execute(
        'DELETE FROM admin_video WHERE video_id = ?',
        [videoId]
    );
    return result.affectedRows > 0;
}


export {
    createAdminVideoModel,
    getAllAdminVideoModel,
    getAdminVideoByIdModel,
    getAdminVideoByUserIdModel,
    getAdminVideoByVideoIdModel,
    getAdminVideoByUserIdAndVideoIdModel,
    updateAdminVideoModel,
    deleteAdminVideoByIdModel,
    deleteVideoAdminByVideoIdModel
}
