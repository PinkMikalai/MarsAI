import { pool } from "../db/index.js";

// Récupérer tous les statuts de sélection
async function getAllSelectionStatusModel() {
    const [rows] = await pool.execute(
        'SELECT id, name FROM selection_status'
    );
    return rows;
}

export { getAllSelectionStatusModel };
