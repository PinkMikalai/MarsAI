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
 try{
    // prépare le nombre de placeholders nécessaires qui correspondent aux nombre de valeurs saisies
    const placeholders = assignments.map(() => "(?,?,?)").join(",");
    // concaténation des tableaux en seul tableau
    const array = assignments.flat();
    const query = `INSERT IGNORE INTO assignation (video_id, user_id, assigned_by) VALUES ${placeholders}`
    const [result] = await pool.execute(query, array)

    return result.affectedRows

 }catch(error){
    console.error("Multiassignment error:", error)
    throw error
 }

}

// récupération des assignements par video 

async function getAssignmentByVideoModel(video_id) {

    try {
        const query = `SELECT a.id, a.assignate_at , u.name AS selector_name , admin.lastname AS admin_name
            FROM  assignation a
            JOIN user u ON a.user_id = u.id
            JOIN user admin ON a.assigned_by = admin.id
            WHERE a.video_id = ? `

        const [rows] = await pool.execute(query, [video_id]);
        return rows;
    } catch (error) {
        console.error('Fetching assignement by video error', error);
        throw error;
    }

}

// récupération des assignements par video 

async function getAssignmentByUserModel(user_id) {

    try {
        const query = `SELECT a.id, a.assignate_at , v.title AS video_title , admin.lastname AS admin_name
            FROM  assignation a
            JOIN video v ON a.video_id = v.id
            JOIN user admin ON a.assigned_by = admin.id
            WHERE a.user_id = ? `

        const [rows] = await pool.execute(query, [user_id]);
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
    


export {
    createAssignmentModel,
    createMultipleAssignmentModel,
    getAssignmentByVideoModel,
    getAssignmentByUserModel,
    updateAssignmentModel,
    deleteAssignmentModel
}