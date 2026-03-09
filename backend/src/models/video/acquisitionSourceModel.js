import { pool } from "../../db/index.js";

async function getAllAcquisitionSourcesModel() {
    const [rows] = await pool.execute('SELECT id, name FROM acquisition_source ORDER BY id');
    return rows;
}

export { getAllAcquisitionSourcesModel };
