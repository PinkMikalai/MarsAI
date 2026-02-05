const { pool } = require('../../db/index.js');

// create award
async function createAwardModel(awardData) {
    const [result] = await pool.execute(
        'INSERT INTO award (title, img, award_rank) VALUES (?, ?, ?)',
        [awardData.title, awardData.img, awardData.award_rank]
    );
    return result.affectedRows > 0;
}

// get all awards
async function getAllAwardsModel() {
    const [rows] = await pool.execute(
        'SELECT * FROM award'
    );
    return rows;
}

// get award by id
async function getAwardByIdModel(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM award WHERE id = ?',
        [id]
    );
    return rows[0];
}

// update award
async function updateAwardModel(id, awardData) {
    const [result] = await pool.execute(
        'UPDATE award SET title = ?, img = ?, award_rank = ? WHERE id = ?',
        [awardData.title, awardData.img, awardData.award_rank, id]
    );
    return result.affectedRows > 0;

}

// delete award
async function deleteAwardModel(id) {
    const [result] = await pool.execute(
        'DELETE FROM award WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

// lier des awards a une video dans la table video_award
async function linkAwardsToVideo(videoId, awardIds) {
    if (!awardIds || awardIds.length === 0) {
        return;
    }
    
    const placeholders = awardIds.map(() => '(?, ?)').join(', ');
    const values = awardIds.flatMap(awardId => [videoId, awardId]);
    
    await pool.execute(
        `INSERT INTO video_award (video_id, award_id) VALUES ${placeholders}`,
        values
    );
}

// supprimer tous les awards d'une video
async function unlinkAwardsFromVideo(videoId) {
    await pool.execute(
        `DELETE FROM video_award WHERE video_id = ?`,
        [videoId]
    );
}

// recuperer les awards d'une video (avec table de liaison video_award)
async function getAwardsByVideoIdModel(videoId) {
    const [rows] = await pool.execute(
        `SELECT award.id, award.title, award.img, award.award_rank, award.created_at 
         FROM award
         INNER JOIN video_award ON award.id = video_award.award_id
         WHERE video_award.video_id = ?`,
        [videoId]
    );
    return rows;
}

//recuperer les videos d'un award (avec table de liaison video_award)
async function getVideosByAwardIdModel(awardId) {
    const [rows] = await pool.execute(
        `SELECT video.* 
         FROM video
         INNER JOIN video_award ON video.id = video_award.video_id
         WHERE video_award.award_id = ?`,
        [awardId]
    );
    return rows;
}

module.exports = {
    createAwardModel,
    getAllAwardsModel,
    getAwardByIdModel,
    updateAwardModel,
    deleteAwardModel,   
    linkAwardsToVideo,
    unlinkAwardsFromVideo,
    getAwardsByVideoIdModel,
    getVideosByAwardIdModel,
}   