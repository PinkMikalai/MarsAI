// JURY - MODEL

const { pool } = require("../db/index.js");

// create jury
async function createJuryModel(juryData) {
    const [result] = await pool.execute(
        'INSERT INTO jury (firstname, lastname, illustration, bio) VALUES (?, ?, ?, ?)',
        [
            juryData.firstname, 
            juryData.lastname, 
            juryData.illustration || null, 
            juryData.bio || null
        ]
    );
    return result.insertId;
}

// get all jury
async function getAllJuryModel() {
    const [rows] = await pool.execute(
        'SELECT * FROM jury'
    );
    return rows;
}

// get jury by id
async function getJuryByIdModel(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM jury WHERE id = ?',
        [id]
    );
    return rows[0];
}

// update jury (mise a jour dynamique)
async function updateJuryModel(id, juryData) {
    //on recupere les champs a modifier
    const fields = [];
    //on recupere les valeurs a modifier
    const values = [];
    
    if (juryData.firstname !== undefined) {
        fields.push('firstname = ?');
        values.push(juryData.firstname);
    }
    if (juryData.lastname !== undefined) {
        fields.push('lastname = ?');
        values.push(juryData.lastname);
    }
    if (juryData.illustration !== undefined) {
        fields.push('illustration = ?');
        values.push(juryData.illustration || null);
    }
    if (juryData.bio !== undefined) {
        fields.push('bio = ?');
        values.push(juryData.bio || null);
    }
    
    //si aucun champ a modifier on retourne null
    if (fields.length === 0) {
        return null;
    }
    
    const query = `UPDATE jury SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const [result] = await pool.execute(query, values);
    //on renvoie l objet result complet
    return result;
}

// delete jury
async function deleteJuryModel(id) {
    const [result] = await pool.execute(
        'DELETE FROM jury WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

module.exports = {
    createJuryModel,     
    getAllJuryModel,
    getJuryByIdModel,
    updateJuryModel,
    deleteJuryModel ,
};