const { pool } =require("../../db/index.js")

// création d'un user
async function createUserModel(userData) {
    try {
        const query = `
            INSERT INTO user (
                email, 
                firstname, 
                lastname, 
                password_hash, 
                role_id
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [
            userData.email || null,
            userData.firstname || null,
            userData.lastname || null,
            userData.password_hash || null,
            userData.role_id || 2
        ]);

        return result.insertId;
    } catch (error) {
        console.error('Error occurred while creating an user profile: ', error);
        throw error;
    }
}


//  Récupérer un utilisateur par son email 
async function getUserByEmailModel(email) {
    try {
        const [rows] = await pool.execute(
            'SELECT id, email,firstname,lastname, password_hash, role_id AS role_id FROM user WHERE email = ?',
            [email]
        );
        console.log("DEBUG SQL", rows[0]); 
        return rows[0];
    } catch (error) {
        throw error;
    }
}

// Récuparation d'un user par son id
 
async function getUserByIdModel(id) {
    try {
        const [rows] = await pool.execute(
            'SELECT id, email, firstname, lastname, role_id FROM user WHERE id = ?',
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error('Error occurred while retrieving data by ID: ', error);
        throw error;
    }
}
// Modification d'un user
async function updateUserModel(id, userData){
    try {
        const fields = [];
        const values = [];

        if (userData.firstname !== undefined) {
            fields.push('firstname = ?');
            values.push(userData.firstname);
        }
        if (userData.lastname !== undefined) {
            fields.push('lastname = ?');
            values.push(userData.lastname);
        }
        if (userData.email !== undefined) {
            fields.push('email = ?');
            values.push(userData.email);
        }
        if (userData.password_hash !== undefined) {
            fields.push('password_hash = ?');
            values.push(userData.password_hash);
        }
        if (userData.role_id !== undefined) {
            fields.push('role_id = ?');
            values.push(userData.role_id);
        }

        if (fields.length === 0) return true;

        const query = `UPDATE user SET ${fields.join(',')} WHERE id=?`; values.push(id);

        const [result] = await pool.execute(query, values);
        return result.affectedRows > 0 ;

    }catch(error) {
        console.error('Erreur SQL updateUserModel:', error);
        throw error;

    }

    
}

//suppression d'un user

async function deleteUserModel(id) {
    try {
        const [result] = await pool.execute(
            'DELETE FROM user WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error( `Error while delating user n°: ${id} `, error);
        throw error;
    }
}

module.exports = {
    createUserModel,
    getUserByEmailModel,
    getUserByIdModel,
    updateUserModel,
    deleteUserModel
};