// SPONSOR - MODEL

// create sponsor
async function createSponsor(sponsorData) {
    const [result] = await pool.execute(
        'INSERT INTO sponsor (name, description, image) VALUES (?, ?, ?)',
        [sponsorData.name, sponsorData.description, sponsorData.image]
    );
    return result.affectedRows > 0;
}

// get all sponsors
async function getAllSponsors() {
    const [rows] = await pool.execute(
        'SELECT * FROM sponsor'
    );
    return rows;
}

// get sponsor by id
async function getSponsorById(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM sponsor WHERE id = ?',
        [id]
    );
    return rows[0];
}

// update sponsor
async function updateSponsor(id, sponsorData) {
    const [result] = await pool.execute(
        'UPDATE sponsor SET name = ?, description = ?, image = ? WHERE id = ?',
        [sponsorData.name, sponsorData.description, sponsorData.image, id]
    );
    return result.affectedRows > 0;
}

// delete sponsor
async function deleteSponsor(id) {
    const [result] = await pool.execute( 
        'DELETE FROM sponsor WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

module.exports = {
    createSponsor,
    getAllSponsors,
    getSponsorById,
    updateSponsor,
    deleteSponsor,
};