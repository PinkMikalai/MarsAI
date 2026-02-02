// =====================================================
// JURY - MODEL
// =====================================================

//ici mes imports
const { pool } = require("../db/index.js");


// create jury
async function createJuryModel(juryData) {
    const [result] = await pool.execute(
        'INSERT INTO jury (name, description, image) VALUES (?, ?, ?)',
        [juryData.name, juryData.description, juryData.image]
    );
    return result.affectedRows > 0;
}

//get all juries
async function getAllJuriesModel() {
    const [rows] = await pool.execute(
        'SELECT * FROM jury'
    );
    return rows;
}


//get jury by id
async function getJuryByIdModel(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM jury WHERE id = ?',
        [id]    );
    return rows[0];
}

// update jury
async function updateJuryModel(id, juryData) {
    const [result] = await pool.execute(
        'UPDATE jury SET name = ?, description = ?, image = ? WHERE id = ?',
        [juryData.name, juryData.description, juryData.image, id]
    );
    return result.affectedRows > 0;
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
    getAllJuriesModel,
    getJuryByIdModel,
    updateJuryModel,
    deleteJuryModel ,
};