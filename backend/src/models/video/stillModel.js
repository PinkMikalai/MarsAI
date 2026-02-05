const { pool } = require('../../db/index.js');

// stills : tableau d'objets 
// videoId : id de la vidéo parent
async function createStillsModel(stills, videoId) {
    try {
        // Sécurité : si aucune image n'est envoyée, on ne fait rien. 
        if (!stills || stills.length === 0)
            return;

        // requête SQL
        const query = ` INSERT INTO still (file_name, video_id) VALUES (?, ?)`; 

        // création d'un tableau de promesses d'exécution. 
        const insertionPromises = stills.map(image => {
            return pool.execute(query, [
                image.file_name, // nom généré par Multer 
                videoId
            ]);
        });

        // on attend que MySQL ait fini d'enregistrer TOUTES les images 
        await Promise.all(insertionPromises);
        return true; 

    } catch (error) {
        console.error('Erreur lors de la création des stills : ', error); 
        throw error;
    }
}

async function getStillsByVideoIdModel(videoId) {
    const [rows] = await pool.execute(
        `SELECT * FROM still WHERE video_id = ?`,
        [videoId]
    );
    return rows;
}

async function updateStillsByVideoIdModel(videoId, stills) {
    const [rows] = await pool.execute(
        `UPDATE still SET file_name = ? WHERE video_id = ?`,
        [stills, videoId]
    );
    return true;
}   

async function deleteStillsByVideoIdModel(videoId) {
    const [rows] = await pool.execute(
        `DELETE FROM still WHERE video_id = ?`,
        [videoId]
    );
    return true;
}

module.exports = { 
     createStillsModel,
     getStillsByVideoIdModel, 
     updateStillsByVideoIdModel,
     deleteStillsByVideoIdModel 
};