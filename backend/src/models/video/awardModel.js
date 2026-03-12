import { pool } from '../../db/index.js';

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

// Récupérer toutes les vidéos qui ont au moins un prix, avec leurs awards
async function getWinnerVideosModel() {
    const [rows] = await pool.execute(
        `SELECT
            v.id,
            v.title,
            v.cover,
            v.realisator_firstname,
            v.realisator_lastname,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id',         a.id,
                    'title',      a.title,
                    'img',        a.img,
                    'award_rank', a.award_rank
                )
            ) AS awards
        FROM video v
        INNER JOIN video_award va ON va.video_id = v.id
        INNER JOIN award a        ON a.id = va.award_id
        GROUP BY v.id, v.title, v.cover, v.realisator_firstname, v.realisator_lastname
        ORDER BY MIN(a.award_rank) ASC`
    );
    return rows.map((row) => ({
        ...row,
        awards: typeof row.awards === 'string' ? JSON.parse(row.awards) : row.awards,
    }));
}

export {
    createAwardModel,
    getAllAwardsModel,
    getAwardByIdModel,
    updateAwardModel,
    deleteAwardModel,   
    linkAwardsToVideo,
    unlinkAwardsFromVideo,
    getAwardsByVideoIdModel,
    getVideosByAwardIdModel,
    getWinnerVideosModel,
}   