import { pool } from "../../db/index.js";

async function getAllAdminStatusModel() {
    const [rows] = await pool.execute('SELECT id, name FROM admin_status');
    return rows;
}

export { getAllAdminStatusModel };
