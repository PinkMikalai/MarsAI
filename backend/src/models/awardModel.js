//
// AWARD - MODEL
// =====================================================

// create award
async function createAward(awardData) {
    const [result] = await pool.execute(
        'INSERT INTO award (name, description, image) VALUES (?, ?, ?)',
        [awardData.name, awardData.description, awardData.image]
    );
    return result.affectedRows > 0;
}

// get all awards
async function getAllAwards() {
    const [rows] = await pool.execute(
        'SELECT * FROM award'
    );
    return rows;
}

// get award by id
async function getAwardById(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM award WHERE id = ?', 
        [id]
    );
    return rows[0];
}

// update award
async function updateAward(id, awardData) {
    const [result] = await pool.execute(
        'UPDATE award SET name = ?, description = ?, image = ? WHERE id = ?',
        [awardData.name, awardData.description, awardData.image, id]
    );
    return result.affectedRows > 0;
}     

// delete award
async function deleteAward(id) {
    const [result] = await pool.execute(
        'DELETE FROM award WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

module.exports = {
    createAward,
    getAllAwards,
    getAwardById,
    updateAward,
    deleteAward,        
};