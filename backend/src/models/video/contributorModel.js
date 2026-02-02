const { pool } = require('../../db/index.js');

async function createContributorsModel(contributors, videoId) {
    try {
        // si pas de contributeurs, on s'arrête là
        if (!contributors || contributors.length === 0) 
            return; 

        const query = `
            INSERT INTO contributor (firstname, last_name, email, gender, production_role, video_id) VALUES (?, ?, ?, ?, ?, ?)`;

        const insertionPromises = contributors.map(person => {
            return pool.execute(query, [
                person.firstname,
                person.last_name,
                person.email || null,
                person.gender || 'Other',
                person.production_role,
                videoId // l'id drécupéré du modèle vidéo 
            ]);
        });

        // on utilise Promise.all pour lancer toutes les insertions en parallele, c'est plus rapide que d'attendre l'un après l'autre 
        await Promise.all(insertionPromises)
        return true; 
    } catch (error) {
        console.error('Erreur lors de la création des contributeurs : ', error); 
        throw error; 

    }
}

module.exports = { createContributorsModel }