import { pool } from "../../db/index.js";


//nettoie les tags (trim, lowercase) et enlève les doublons! mettre en miniscule
function normalizeTags(tags = []) {
    return [...new Set(
        tags
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0)
    )];
}

//creer les tags qui n existe pas encore et leurs renvoie les id des tags crees (id + name)
async function createTagModel(cleanTags) {
    if (cleanTags.length === 0) {
        return [];
    }

    //recuperer les tags qui existent deja
    const tagPlaceholders = cleanTags.map(() => '?').join(', ');
    const [existingTags] = await pool.execute(
        `SELECT id, name FROM tag WHERE name IN (${tagPlaceholders})`,
        cleanTags
    );
    
    //identifier les noms des tags existants
    const existingNames = existingTags.map(t => t.name);
    
    //filtrer pour ne garder que les nouveaux tags a creer
    const newTags = cleanTags.filter(tag => !existingNames.includes(tag));
    
    //inserer uniquement les nouveaux tags
    if (newTags.length > 0) {
        const placeholders = newTags.map(() => '(?)').join(', ');
        await pool.execute(
            `INSERT INTO tag (name) VALUES ${placeholders}`,
            newTags
        );
    }
    
    //recuperer TOUS les tags (existants + nouveaux)
    const [allTags] = await pool.execute(
        `SELECT id, name FROM tag WHERE name IN (${tagPlaceholders})`,
        cleanTags
    );
    
    return allTags;
}



//lier les tags a une video dans la table video_tag
async function linkTagsToVideo(videoId, tagIds) {
    if (!tagIds || tagIds.length === 0) {
        return;
    }
    
    const placeholders = tagIds.map(() => '(?, ?)').join(', ');
    const values = tagIds.flatMap(tagId => [videoId, tagId]);
    
    await pool.execute(
        `INSERT INTO video_tag (video_id, tag_id) VALUES ${placeholders}`,
        values
    );
}

//supprimer tous les tags d une video
async function unlinkTagsFromVideo(videoId) {
    await pool.execute(
        `DELETE FROM video_tag WHERE video_id = ?`,
        [videoId]
    );
}

//recuperer tous les tags d une video
async function getTagsByVideoId(videoId) {
    const [rows] = await pool.execute(
        `SELECT tag.id, tag.name 
         FROM tag
         INNER JOIN video_tag ON tag.id = video_tag.tag_id
         WHERE video_tag.video_id = ?`,
        [videoId]
    );
    return rows;
}

//les tags plus utilisee
async function getMostUsedTagsModel() {
    const [rows] = await pool.execute(
        `SELECT tag.name, COUNT(video_tag.video_id) AS usage_count
        FROM tag
        LEFT JOIN video_tag ON tag.id = video_tag.tag_id
        GROUP BY tag.id
        ORDER BY usage_count DESC
        LIMIT 10`
    );
    return rows; 
}


export { 
    createTagModel, 
    normalizeTags,
    getMostUsedTagsModel,
    linkTagsToVideo,
    unlinkTagsFromVideo,
    getTagsByVideoId
};