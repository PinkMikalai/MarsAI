const { pool } = require("../../db/index.js"); 

// create video : créer une nouvelle entrée dans la table 'video' 
// videoData : données validées provenant du controller (req.body)
async function createVideoModel(videoData) {
    try {
        // la requête SQL avec des "placeholders" (?) pour la sécurité (évite les injections SQL)
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
        
        // pool.execute envoie la requête et les données séparément au serveur 
        const [result] = await pool.execute(query, [
            // on utilise || null pour s'assurer que si la donnée est absente, MySQL reçoive NULL et non 'undefined' pour ne pas faire planter la requete 
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
            videoData.realisator_civility || 'Mrs', // valeur par défaut si non renseigné 
            videoData.birthdate || null,
            videoData.mobile_number,
            videoData.phone_number || null,
            videoData.address,
            // conversion de l'objet JS en chaîne de caractères JSON pour le stockage 
            videoData.social_media_links_json ? JSON.stringify(videoData.social_media_links_json) : null,
            videoData.acquisition_source_id || null
        ]);
        
        // on retourne l'identifiant unique que MySQL vient de créer pour cette vidéo 
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

// get video by id, infos pour tout les mondes
async function getVideoByIdModel(id) {
    try {
            
        const [rows] = await pool.execute(
            `SELECT 
                JSON_OBJECT(
                    'id', v.id,
                    'video_file_name', v.video_file_name,
                    'title', v.title,
                    'synopsis', v.synopsis,
                    'synopsis_en', v.synopsis_en,
                    'cover', v.cover,
                    'language', v.language,
                    'country', v.country,
                    'duration', v.duration,
                    'realisator_firstname', v.realisator_firstname,
                    'realisator_lastname', v.realisator_lastname,
                    'social_media_links_json', v.social_media_links_json,
                    'tag', IFNULL(
                        (
                            SELECT JSON_ARRAYAGG(t.name)
                            FROM video_tag vt
                            JOIN tag t ON t.id = vt.tag_id
                            WHERE vt.video_id = v.id
                        ),
                        JSON_ARRAY()
                    ),
                    'still', IFNULL(
                        (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', s.id,
                                    'file_name', s.file_name,
                                    'created_at', s.created_at
                                )
                            )
                            FROM still s
                            WHERE s.video_id = v.id
                        ),
                        JSON_ARRAY()
                    ),
                    'award', IFNULL(
                        (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', a.id,
                                    'title', a.title,
                                    'img', a.img,
                                    'award_rank', a.award_rank
                                )
                            )
                            FROM video_award va
                            JOIN award a ON a.id = va.award_id
                            WHERE va.video_id = v.id
                        ),
                        JSON_ARRAY()
                    )
                ) AS video_json
            FROM video v
            WHERE v.id = ?`,
        [id]    
        );
        return rows;
    } catch (error) {

        console.error('erreur lors de la recuperation de la video: ', error);
        throw error;
    }
}
// get video by id, infos pour l'admin
async function getAdminVideoDataByIdModel(id) {
    try {
        const [rows] = await pool.execute(
            `SELECT 
            JSON_OBJECT(
                'id', v.id,
                'youtube_url', v.youtube_url,
                'srt_file_name', v.srt_file_name,
                'tech_resume', v.tech_resume,
                'classification', v.classification,
                'creative_resume', v.creative_resume,
                'email', v.email,
                'realisator_civility', v.realisator_civility,
                'birthdate', v.birthdate,
                'mobile_number', v.mobile_number,
                'phone_number', v.phone_number,
                'address', v.address,
                'acquisition_source', IFNULL(
                    JSON_OBJECT(
                        'id', acs.id,
                        'name', acs.name
                    ),
                    NULL
                ),
                'contributors', IFNULL(
                    (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', c.id,
                            'firstname', c.firstname,
                            'last_name', c.last_name,
                            'email', c.email,
                            'production_role', c.production_role,
                            'created_at', c.created_at
                        )
                    )
                    FROM contributor c
                    WHERE c.video_id = v.id),
                    JSON_ARRAY()
                ),
                'admin_videos', IFNULL(
                    (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', av.id,
                            'comment', av.comment,
                            'user_id', av.user_id,
                            'admin_status', JSON_OBJECT(
                                'id', ast.id,
                                'name', ast.name
                            ),
                            'created_at', av.created_at,
                            'updated_at', av.updated_at
                        )
                    )
                    FROM admin_video av
                    JOIN admin_status ast ON ast.id = av.admin_status_id
                    WHERE av.video_id = v.id),
                    JSON_ARRAY()
                )
            ) AS video_json
            FROM video v
            LEFT JOIN acquisition_source acs ON v.acquisition_source_id = acs.id
            WHERE v.id = ?`,
            [id]
        );
        return rows;
    } catch (error) {
        console.error("erreur lors de la recuperation des donnees pour l'admin: ", error);
        throw error;
    }




}

// get video by id, infos pour le selector (selector_memo filtré par video + user connecté)
async function getSelectorVideoDataByIdModel(id, userId) {

    try {
        const [rows] = await pool.execute(
            `SELECT JSON_OBJECT(
                'id', v.id,
                'synopsis', v.synopsis,
                'synopsis_en', v.synopsis_en,
                'tech_resume', v.tech_resume,
                'classification', v.classification,
                'creative_resume', v.creative_resume,
                'contributors', IFNULL(
                    (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', c.id,
                            'firstname', c.firstname,
                            'last_name', c.last_name,
                            'email', c.email,
                            'production_role', c.production_role,
                            'created_at', c.created_at
                        )
                    )
                    FROM contributor c
                    WHERE c.video_id = v.id),
                    JSON_ARRAY()
                ),
                'selector_memo', IFNULL(
                    JSON_OBJECT(
                        'id', sm.id,
                        'comment', sm.comment,
                        'rating', sm.rating,
                        'user_id', sm.user_id,
                        'created_at', sm.created_at,
                        'updated_at', sm.updated_at,
                        'selection_status', IFNULL(
                            JSON_OBJECT(
                                'id', ss.id, 
                                'name', ss.name),
                            NULL
                        )
                    ),
                    NULL
                )
            ) AS video_json 
             FROM video v 
             LEFT JOIN selector_memo sm ON sm.video_id = v.id AND sm.user_id = ?
             LEFT JOIN selection_status ss ON ss.id = sm.selection_status_id
             WHERE v.id = ?`,
            [userId ?? null, id]
        );
        return rows;
    } catch (error) {
        console.error('erreur lors de la recuperation des donnees pour le selector: ', error);
        throw error;
    }

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
    getAdminVideoDataByIdModel,
    getSelectorVideoDataByIdModel,
    updateVideoModel,
    deleteVideoModel,
};