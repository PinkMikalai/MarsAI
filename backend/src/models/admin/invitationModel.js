const { pool } = require("../../db/index.js");

async function createInvitationModel({ jti, email, role}) {
    const query = `
        INSERT INTO invitation (jti, email, role, status) VALUES (?, ?, ?, 'pending')
    `;
    const [result] = await pool.execute(query , [jti, email,role]);
    return result.insertId;
    
}

async function getInvitationByJtiModel(jti) {

    const query = `SELECT FRON invitation id, email, role WHERE jti = ?`;
    const [rows] = await pool.execute( query, [jti]);
    return rows[0];

}

async function getInvitationByIdModel(id) {

    const query = `SELECT FRON invitation id, email, role WHERE id = ?`;
    const [rows] = await pool.execute( query, [id]);
    return rows[0];

}

async function markInvitationAsUsedMdel(jti) {
    const query = `UPDATE invitation SET status = 'used' WHERE jti = ?`;
    const [result] = await pool.execute( query, [jti]);
    return result.affectedRows > 0;
}

module.exports = {
    createInvitationModel,
    getInvitationByIdModel,
    getInvitationByJtiModel,
    markInvitationAsUsedMdel
}