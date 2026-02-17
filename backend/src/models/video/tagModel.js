import { pool } from "../../db/index.js";

function normalizeTags(tags = []) {
    return [...new Set(
        tags
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0)
    )];
}

async function createTagModel(cleanTags) {
    if (cleanTags.length === 0) {
        return [];
    }

    const tagPlaceholders = cleanTags.map(() => '?').join(', ');
    const [existingTags] = await pool.execute(
        `SELECT id, name FROM tag WHERE name IN (${tagPlaceholders})`,
        cleanTags
    );
    
    const existingNames = existingTags.map(t => t.name);
    const newTags = cleanTags.filter(tag => !existingNames.includes(tag));
    
    if (newTags.length > 0) {
        const placeholders = newTags.map(() => '(?)').join(', ');
        await pool.execute(
            `INSERT INTO tag (name) VALUES ${placeholders}`,
            newTags
        );
    }
    
    const [allTags] = await pool.execute(
        `SELECT id, name FROM tag WHERE name IN (${tagPlaceholders})`,
        cleanTags
    );
    
    return allTags;
}

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

async function unlinkTagsFromVideo(videoId) {
    await pool.execute(
        `DELETE FROM video_tag WHERE video_id = ?`,
        [videoId]
    );
}

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
