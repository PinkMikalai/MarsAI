import { pool } from "../../db/index.js";

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

//  Récupérer tous les users 
async function getAllUsersModel() {
    try {
        const [rows] = await pool.execute(
            'SELECT id, email,firstname,lastname, password_hash, role_id AS role_id FROM user ');
        return rows;
    } catch (error) {
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
            'SELECT id, email, firstname, lastname, password_hash, role_id FROM user WHERE id = ?',
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error('Error occurred while retrieving data by ID: ', error);
        throw error;
    }
}
// Modification d'un user
async function updateUserModel(id, userData) {
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

        if (userData.password_hash !== undefined) {
            fields.push('password_hash = ?');
            values.push(userData.password_hash);
        }


        if (fields.length === 0) return true;

        const query = `UPDATE user SET ${fields.join(',')} WHERE id = ?`; values.push(id);

        const [result] = await pool.execute(query, values);
        return result.affectedRows > 0;

    } catch (error) {
        console.error('Erreur SQL updateUserModel:', error);
        throw error;

    }

}

// modification d'un email ou d'un role par le super_admin
async function updateUserBySuperAdminModel(id, userData) {
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
        return result.affectedRows > 0;

    } catch (error) {
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
        console.error(`Error while delating user n°: ${id} `, error);
        throw error;
    }
}
// récupérattion de tous les roles
async function getAllRolesModel() {
    try {
        const [rows] = await pool.execute('SELECT id, name FROM role');
        return rows;
    } catch (error) {
        console.error('Error occurred while retrieving data ', error);
        throw error;
    }

}
// récuparation des roles par leur id
async function getRoleByIdModel(id) {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name FROM role WHERE id = ?',
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error('Error occurred while retrieving data by ID: ', error);
        throw error;
    }
}
// récuparation des roles par leur NOM
async function getRoleByNameModel(name) {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name FROM role WHERE name = ?',
            [name]
        );
        return rows[0];
    } catch (error) {
        console.error('Error occurred while retrieving data by NAME: ', error);
        throw error;
    }
}
// création d'un role
async function createRoleModel(name) {
    if (!name) {
        throw new Error('Role is required')
    }
    try {
        const query =
            ` INSERT INTO role (name) VALUES (?)`;

        const [result] = await pool.execute(query, [name || null]);

        return result.insertId;
    } catch (error) {
        console.error('Error occurred while creating an user profile: ', error);
        throw error;
    }
}

export {
    createUserModel,
    getAllUsersModel,
    getUserByEmailModel,
    getUserByIdModel,
    updateUserModel,
    updateUserBySuperAdminModel,
    deleteUserModel,
    getAllRolesModel,
    getRoleByIdModel,
    getRoleByNameModel,
    createRoleModel
};