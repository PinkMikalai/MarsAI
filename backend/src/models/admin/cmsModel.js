import { pool } from "../../db/index.js";


async function createCmsModel({ element, english_content, french_content, illustration, user_id, is_active, start_date, end_date, components }){
    const query = `INSERT INTO cms (element, english_content, french_content, illustration, user_id, is_active, start_date, end_date, components) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [element, english_content, french_content, illustration, user_id, is_active, start_date, end_date, components]);
    return result.affectedRows > 0;
}

async function getAllCmsModel(){
    const query = `SELECT * FROM cms`;
    const [rows] = await pool.execute(query);
    return rows;
}

async function getActiveCmsModel(){
    const query = `SELECT * FROM cms WHERE is_active = 1`;
    const [rows] = await pool.execute(query);
    return rows[0];
}

async function getCmsByIdModel(id){
    const query = `SELECT * FROM cms WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
}

async function updateCmsModel(id, { element, english_content, french_content, illustration, user_id, is_active, start_date, end_date, components }){
    const query = `UPDATE cms SET element = ?, english_content = ?, french_content = ?, illustration = ?, user_id = ?, is_active = ?, start_date = ?, end_date = ?, components = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [element, english_content, french_content, illustration, user_id, is_active, start_date, end_date, components, id]);
    return result.affectedRows > 0;
}

async function deleteCmsModel(id){
    const query = `DELETE FROM cms WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
}

export {
    createCmsModel,
    getAllCmsModel,
    getActiveCmsModel,
    getCmsByIdModel,
    updateCmsModel,
    deleteCmsModel
}