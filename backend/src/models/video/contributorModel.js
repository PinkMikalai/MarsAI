const { pool } = require('../../db/index.js');

// contributors - tableau d'objets 
// videoId 6 - l'id de la video parente 
async function createContributorsModel(contributors, videoId) {
    try {
        // Sécurité : si le formulaire est envoyé sans contributeurs, on sort proprement sans tenter de faire une requête SQL vide qui ferait planter le serveur 
        if (!contributors || contributors.length === 0) 
            return; 

        // on prépare la requête pour UN contributeur.
        const query = `
            INSERT INTO contributor (firstname, last_name, email, production_role, video_id) VALUES (?, ?, ?, ?, ?)`;

        // .map() transforme ton tableau de données en un tableau de PROMESSES. 
        // chaque appel à pool.execute() lance une requête mais ne l'attends pas immédiatement 
        const insertionPromises = contributors.map(person => {
            return pool.execute(query, [
                person.firstname,
                person.last_name,
                person.email || null,
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