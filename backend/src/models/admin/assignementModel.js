import { pool } from "../../db/index.js";


// création des assignements
async function createAssignmentModel({ video_id, user_id, assigned_by }) {
    try {
        const query = `INSERT INTO assignation (video_id, user_id, assigned_by) VALUES(?,?,?)`;
        const [result] = await pool.execute(query, [video_id, user_id, assigned_by]);
        return result.insertId;

    } catch (error) {
        console.error('Assignement creation error', error);
        throw error;

    }

}
// assignation multiple : une video à plusieurs selectionneurs ou plusieurs videos à un selectionneur
async function createMultipleAssignmentModel(assignments) {
    try {
        // prépare le nombre de placeholders nécessaires qui correspondent aux nombre de valeurs saisies
        const placeholders = assignments.map(() => "(?,?,?)").join(",");
        // concaténation des tableaux en seul tableau
        const array = assignments.flat();
        const query = `INSERT IGNORE INTO assignation (video_id, user_id, assigned_by) VALUES ${placeholders}`
        const [result] = await pool.execute(query, array)

        return result.affectedRows

    } catch (error) {
        console.error("Multiassignment error:", error)
        throw error
    }

}

// récupération des assignements par video 

async function getAssignmentByVideoModel(video_id) {

    try {
        const query = `SELECT a.id AS assignment_id, a.assignate_at , 
                       u.id AS user_id, u.firstname, u.lastname , 
                       admin.firstname AS admin_firstname
            FROM  assignation a
            JOIN user u ON a.user_id = u.id
            LEFT JOIN user admin ON a.assigned_by = admin.id
            WHERE a.video_id = ? `

        const [rows] = await pool.execute(query, [video_id]);
        return rows;
    } catch (error) {
        console.error('Fetching assignement by video error', error);
        throw error;
    }

}

// récupération des assignements pour un selectionneur 

async function getAssignmentByUserModel(user_id) {

    try {
        const query = `
    SELECT a.id,
           a.video_id,
           a.assignate_at,
           v.title          AS video_title,
           v.cover          AS cover,
           v.country        AS country,
           v.realisator_firstname,
           v.realisator_lastname,
           admin.firstname  AS admin_firstname
    FROM assignation a
    LEFT JOIN video v     ON a.video_id = v.id
    LEFT JOIN user admin  ON a.assigned_by = admin.id
    WHERE a.user_id = ?
`;
        console.log("Requête SQL exécutée :", "SELECT * FROM assignation WHERE user_id = ?", [user_id]);
        const [rows] = await pool.execute(query, [user_id]);
        console.log("Résultats trouvés en base :", rows);
        return rows;
    } catch (error) {
        console.error('Fetching assignement by user error', error);
        throw error;
    }
}

// Modification de l'assignement

async function updateAssignmentModel(id, { video_id, user_id, assigned_by }) {
    try {
        const fields = [];
        const values = [];

        if (video_id) {
            fields.push('video_id = ?');
            values.push(video_id);
        }
        if (user_id) {
            fields.push('user_id = ?');
            values.push(user_id);
        }


        if (assigned_by) {
            fields.push('assigned_by = ?');
            values.push(assigned_by);
        }

        if (fields.length === 0) return false;

        const query = `UPDATE assignation SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        const [result] = await pool.execute(query, values);
        return result.affectedRows > 0;

    } catch (error) {
        console.error('Updating assignment error', error);
        throw error;
    }
}

// suppression de l'assignement 

async function deleteAssignmentModel(id) {

    try {
        const [result] = await pool.execute(
            'DELETE FROM assignation WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Delating assignement error ', error);
        throw error;
    }
}

// compteur du nombre d'assignations par user 

async function getSelectorLoadModel() {

    try {
        const query = `SELECT user.id, user.firstname , user.lastname, user.email,
            COUNT(assignation.id) as current_load
            FROM  user
            LEFT JOIN assignation ON user.id = assignation.user_id 
            WHERE user.role_id = 2
            GROUP by user.id, user.firstname, user.lastname, user.email
            ORDER by current_load ASC `

        const [rows] = await pool.execute(query);
        return rows;

    } catch (error) {
        console.error('Error fetching selector films load', error);
        throw error;

    }

}
//gestion de la création des assignations simutanément avec le nettoyage des données d'assignation
async function syncVideoAssignmentModel(video_id, user_ids, admin_id) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Supprimer toutes les assignations actuelles pour cette vidéo
        await connection.execute('DELETE FROM assignation WHERE video_id = ?', [video_id]);

        // Insérer la nouvelle liste (si elle n'est pas vide)
        if (user_ids && user_ids.length > 0) {
            const values = user_ids.map(u_id => [video_id, u_id, admin_id]);

            const placeholders = values.map(() => "(?,?,?)").join(",");
            const flatValues = values.flat();

            const query = `INSERT INTO assignation (video_id, user_id, assigned_by) VALUES ${placeholders}`;
            await connection.execute(query, flatValues);
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export {
    createAssignmentModel,
    createMultipleAssignmentModel,
    getAssignmentByVideoModel,
    getAssignmentByUserModel,
    updateAssignmentModel,
    deleteAssignmentModel,
    getSelectorLoadModel,
    syncVideoAssignmentModel

}