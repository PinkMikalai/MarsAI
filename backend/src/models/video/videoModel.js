const { pool } = require("../../db/index.js"); 
// =====================================================
// VIDEO - MODEL
// =====================================================



// create video
async function createVideoModel(videoData) {
    try {
        const query = `
            INSERT INTO video (
                youtube_url, video_file_name, srt_file_name,
                title_en, title, synopsis_en, synopsis, cover,
                language, country, duration, tech_resume,
                classification, creative_resume, email,
                realisator_firstname, realisator_lastname,
                realisator_civility, birthdate, mobile_number,
                phone_number, address, social_media_links_json,
                acquisition_source_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            videoData.youtube_url || null,
            videoData.video_file_name,
            videoData.srt_file_name || null,
            videoData.title_en,
            videoData.title || null,
            videoData.synopsis_en,
            videoData.synopsis || null,
            videoData.cover,
            videoData.language,
            videoData.country,
            videoData.duration || null,
            videoData.tech_resume,
            videoData.classification,
            videoData.creative_resume,
            videoData.email,
            videoData.realisator_firstname || null,
            videoData.realisator_lastname || null,
            videoData.realisator_civility || 'Mrs',
            videoData.birthdate || null,
            videoData.mobile_number,
            videoData.phone_number || null,
            videoData.address,
            videoData.social_media_links_json ? JSON.stringify(videoData.social_media_links_json) : null,
            videoData.acquisition_source_id || null
        ]);
        
        return result.insertId;
    } catch (error) {
        console.error('erreur lors de la creation de la video: ', error);
        throw error;
    }
}

// get all videos
async function getAllVideosModel() {
   
    const [rows] = await pool.execute(  
        'SELECT * FROM video'
    );
    return rows;
    
}

// get video by id
async function getVideoByIdModel(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM video WHERE id = ?',
        [id]
    );
    return rows[0];
}
// update video (mise a jour dynamique : seulement les champs fournis)
async function updateVideoModel(id, videoData) {
    try {
        //construire la requete dynamiquement avec seulement les champs fournis
        const fields = [];
        const values = [];
        
        //parcourir les champs et ajouter seulement ceux qui existent
        if (videoData.youtube_url !== undefined) {
            fields.push('youtube_url = ?');
            values.push(videoData.youtube_url || null);
        }
        if (videoData.video_file_name !== undefined) {
            fields.push('video_file_name = ?');
            values.push(videoData.video_file_name);
        }
        if (videoData.srt_file_name !== undefined) {
            fields.push('srt_file_name = ?');
            values.push(videoData.srt_file_name || null);
        }
        if (videoData.title_en !== undefined) {
            fields.push('title_en = ?');
            values.push(videoData.title_en);
        }
        if (videoData.title !== undefined) {
            fields.push('title = ?');
            values.push(videoData.title || null);
        }
        if (videoData.synopsis_en !== undefined) {
            fields.push('synopsis_en = ?');
            values.push(videoData.synopsis_en);
        }
        if (videoData.synopsis !== undefined) {
            fields.push('synopsis = ?');
            values.push(videoData.synopsis || null);
        }
        if (videoData.cover !== undefined) {
            fields.push('cover = ?');
            values.push(videoData.cover);
        }
        if (videoData.language !== undefined) {
            fields.push('language = ?');
            values.push(videoData.language);
        }
        if (videoData.country !== undefined) {
            fields.push('country = ?');
            values.push(videoData.country);
        }
        if (videoData.duration !== undefined) {
            fields.push('duration = ?');
            values.push(videoData.duration || null);
        }
        if (videoData.tech_resume !== undefined) {
            fields.push('tech_resume = ?');
            values.push(videoData.tech_resume);
        }
        if (videoData.classification !== undefined) {
            fields.push('classification = ?');
            values.push(videoData.classification);
        }
        if (videoData.creative_resume !== undefined) {
            fields.push('creative_resume = ?');
            values.push(videoData.creative_resume);
        }
        if (videoData.email !== undefined) {
            fields.push('email = ?');
            values.push(videoData.email);
        }
        if (videoData.realisator_firstname !== undefined) {
            fields.push('realisator_firstname = ?');
            values.push(videoData.realisator_firstname || null);
        }
        if (videoData.realisator_lastname !== undefined) {
            fields.push('realisator_lastname = ?');
            values.push(videoData.realisator_lastname || null);
        }
        if (videoData.realisator_civility !== undefined) {
            fields.push('realisator_civility = ?');
            values.push(videoData.realisator_civility || 'Mrs');
        }
        if (videoData.birthdate !== undefined) {
            fields.push('birthdate = ?');
            values.push(videoData.birthdate || null);
        }
        if (videoData.mobile_number !== undefined) {
            fields.push('mobile_number = ?');
            values.push(videoData.mobile_number);
        }
        if (videoData.phone_number !== undefined) {
            fields.push('phone_number = ?');
            values.push(videoData.phone_number || null);
        }
        if (videoData.address !== undefined) {
            fields.push('address = ?');
            values.push(videoData.address);
        }
        if (videoData.social_media_links_json !== undefined) {
            fields.push('social_media_links_json = ?');
            values.push(videoData.social_media_links_json ? JSON.stringify(videoData.social_media_links_json) : null);
        }
        if (videoData.acquisition_source_id !== undefined) {
            fields.push('acquisition_source_id = ?');
            values.push(videoData.acquisition_source_id || null);
        }
        
        //si aucun champ a mettre a jour
        if (fields.length === 0) {
            return true;
        }
        
        //construire la requete finale
        const query = `UPDATE video SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);
        
        console.log('query update', query);
        console.log('values update', values);
        
        const [result] = await pool.execute(query, values);
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('erreur lors de la mise a jour de la video: ', error);
        throw error;
    }
}

// delete video
async function deleteVideoModel(id) {
    try {
        const [result] = await pool.execute(
            'DELETE FROM video WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('erreur lors de la suppression de la video: ', error);
        throw error;
    }
}

module.exports = {
    createVideoModel,
    getAllVideosModel,
    getVideoByIdModel,
    updateVideoModel,
    deleteVideoModel,
};