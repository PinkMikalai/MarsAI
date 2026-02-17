import { pool } from "../../db/index.js";


// création des assignements
async function createAssignementModel({ video_id, user_id, assigned_by }) {
    try {
        const query = `INSERT INTO assignement (video_id, user_id, assigned_by) VALUES(?,?,?)`;
        const [result] = await pool.execute(query, [video_id, user_id, assigned_by]);
        return result.insertId;

    } catch (error) {
        console.error('Assignement creation error', error);
        throw error;

    }

}

// récupération des assignements par video 

async function getAssignementByVideoModel(video_id) {

    try {
        const query = `SELECT a.id, a.assignate_at , u.name AS selector_name , admin.lastname AS admin_name
            FROM  assignement a
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

async function getAssignementByUserModel(user_id) {

    try {
        const query = `SELECT a.id, a.assignate_at , v.title AS video_title , admin.lastname AS admin_name
            FROM  assignement a
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

async function updateAssignementModel(id, {video_id, user_id}) {
    try{
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
            fields.push('assigned_by');
            values.push(assigned_by)
        }
        if (assignate_at){
            fields.push('assignate_at');
            values.push(assignate_at)
        }

        if (fields.length === 0) return false;

        const query = `UPDATE assignement SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        const [result] = await pool.execute(query, values);
        return result.affectedRows > 0;

    }catch(error){
        console.error('Updating assignement error', error);
        throw error;
    }
    
}

// suppression de l'assignement 

async function deleteAssignementModel(id) {

    try {
        const [result] = await pool.execute(
            'DELETE FROM assignement WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Delating assignement error ', error);
        throw error;
    }
}
    


export {
    createAssignementModel,
    getAssignementByVideoModel,
    getAssignementByUserModel,
    updateAssignementModel,
    deleteAssignementModel
}