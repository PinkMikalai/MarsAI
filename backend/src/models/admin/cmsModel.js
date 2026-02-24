
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



// création d'un élément du cms
async function createCmsElementModel(cmsData) {
    const [result] = await pool.execute(
        'INSERT INTO CMS (element, english_content, french_content, illustration, user_id) VALUES (?, ?, ?, ?, ?)',
        [
            cmsDataData.element,
            cmsData.english_content,
            cmsData.french_content,
            cmsData.illustration || null,
            cmsData.user_id
        ]
    );
    return result.insertId;
}

// recupération de tous les éléments 
async function getAllCmsElementModel() {
    const [rows] = await pool.execute(
        'SELECT element, english_content, french_content, illustration, user_id FROM cms'
    );
    return rows;
}

// récupertation d'un élément par son id
async function getCmsElementByIdModel(id) {
    const [rows] = await pool.execute(
        'SELECT element, english_content, french_content, illustration, user_id FROM cms WHERE id = ?',
        [id]
    );
    return rows[0];
}

// update d'un élément 
async function updateCmsElementModel(id, cmsData) {
    //on recupere les champs a modifier
    const fields = [];
    //on recupere les valeurs a modifier
    const values = [];

    if (cmsData.element !== undefined) {
        fields.push('element = ?');
        values.push(cmsData.element);
    }
    if (cmsData.english_content !== undefined) {
        fields.push('english_content = ?');
        values.push(cmsData.english_content);
    }
    if (cmsData.french_content !== undefined) {
        fields.push('french_content = ?');
        values.push(cmsData.french_content || null);
    }
    if (cmsData.illustration !== undefined) {
        fields.push('illustration = ?');
        values.push(cmsData.illustration || null);
    }
    if (cmsData.user_id !== undefined) {
        fields.push('user_id = ?');
        values.push(cmsData.user_id || null);
    }

    //si aucun champ a modifier on retourne null
    if (fields.length === 0) {
        return null;
    }

    const query = `UPDATE cms SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.execute(query, values);

    return result;
}

// delete element
async function deleteCmsElementModel(id) {
    const [result] = await pool.execute(
        'DELETE FROM cms WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}
// get par élément name

async function getCmsElementModel(elmentName) {
    const query = 'SELECT  english_content, french_content, illustration, user_id FROM cms WHERE element = ?'
    try {
        const [rows] = await pool.execute(query, [elmentName]);
        return rows[0] || null;

    } catch (error) {
        console.error("", error);
        throw error;
    }
}

// update des élements date

async function updateCmsElementDate(elmentName, newDate) {
    const query = 'UPDATE cms  set english_content = ?, updated_at = NOW() WHERE element = ?'
    try {
        const result = await pool.execute(query, [])
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error updating date element from CMS", error);
        throw error;
    }
}

// récupération des éléments du compte à rebours
async function getCountDownModel() {
    try {
        const query = 'SELECT element, english_content, french_content FROM cms element WHERE IN (?, ?, ?) '
        const [rows] = await pool.execute(query, ['submissions_open', 'countdown_deadline', 'festival_start']);
        return rows
    } catch (error) {
        console.error("Error fetching countdown dates from CMS", error);
        throw error;

    }
}
export {
    createCmsElementModel,
    getAllCmsElementModel,
    getCmsElementByIdModel,
    updateCmsElementModel,
    deleteCmsElementModel,
    getCmsElementModel,
    updateCmsElementDate,
    getCountDownModel,
    getAllCmsModel, 
    getCmsByIdModel, 
    updateCmsModel };
};

