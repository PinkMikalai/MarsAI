// SPONSOR - MODEL
const { pool } = require("../db/index.js");

// create sponsor
async function createSponsorModel(sponsorData) {
    const [result] = await pool.execute(
        'INSERT INTO sponsor (name, img, url) VALUES (?, ?, ?)',
        [sponsorData.name, sponsorData.img || null, sponsorData.url || null]
    );
    return result.insertId;
}

// get all sponsors
async function getAllSponsorsModel() {
    const [rows] = await pool.execute(
        'SELECT * FROM sponsor'
    );
    return rows;
}

// get sponsor by id
async function getSponsorByIdModel(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM sponsor WHERE id = ?',
        [id]
    );
    return rows[0];
}

// update sponsor (mise a jour dynamique)
async function updateSponsorModel(id, sponsorData) {
    //on recupere les champs a modifier
    const fields = [];
    //on recupere les valeurs a modifier
    const values = [];
    
    if (sponsorData.name !== undefined) {
        fields.push('name = ?');
        values.push(sponsorData.name);
    }
    if (sponsorData.img !== undefined) {
        fields.push('img = ?');
        values.push(sponsorData.img || null);
    }
    if (sponsorData.url !== undefined) {
        fields.push('url = ?');
        values.push(sponsorData.url || null);
    }
    
    //si aucun champ a modifier on retourne null
    if (fields.length === 0) {
        return null;
    }
    
    const query = `UPDATE sponsor SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const [result] = await pool.execute(query, values);
    //on renvoie l objet result complet
    return result;
}

// delete sponsor
async function deleteSponsorModel(id) {
    const [result] = await pool.execute( 
        'DELETE FROM sponsor WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

module.exports = {
    createSponsorModel,
    getAllSponsorsModel,
    getSponsorByIdModel,
    updateSponsorModel,
    deleteSponsorModel,
};
