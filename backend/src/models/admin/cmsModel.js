import { pool } from "../../db/index.js";

async function getAllCmsModel() {
  const [rows] = await pool.execute(
    "SELECT id, element, english_content, french_content, illustration, user_id, updated_at FROM cms ORDER BY id"
  );
  return rows;
}

async function getCmsByIdModel(id) {
  const [rows] = await pool.execute(
    "SELECT id, element, english_content, french_content, illustration, user_id, updated_at FROM cms WHERE id = ?",
    [id]
  );
  return rows[0] ?? null;
}

async function updateCmsModel(id, data) {
  const [result] = await pool.execute(
    `UPDATE cms SET
      english_content = ?,
      french_content = ?,
      illustration = ?,
      user_id = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [
      data.english_content ?? null,
      data.french_content ?? null,
      data.illustration ?? null,
      data.user_id ?? null,
      id,
    ]
  );
  return result.affectedRows;
}

export { getAllCmsModel, getCmsByIdModel, updateCmsModel };