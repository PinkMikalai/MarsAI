import { pool } from "../db/index.js";

/**
 * Création nouvel événement
 */
async function createEventModel(eventData) {
  const [result] = await pool.execute(
    `INSERT INTO event 
     (title, description, date, duration, capacity, illustration, location, id_USER) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      eventData.title,
      eventData.description ?? null,
      eventData.date,
      eventData.duration ?? null,
      eventData.capacity ?? null,
      eventData.illustration ?? null,
      eventData.location ?? null,
      eventData.id_USER ?? null,
    ]
  );

  return result.insertId;
}

/**
 * Récupérer events
 */
async function getAllEventsModel() {
  const [rows] = await pool.execute("SELECT * FROM event");
  return rows;
}

/**
 * Récupérer un events par ID
 */
async function getEventByIdModel(id) {
  const [rows] = await pool.execute(
    "SELECT * FROM event WHERE id = ?",
    [id]
  );

  return rows[0] || null;
}

/**
 *MAJ EVENTS ____________________________________(UPDATE complet)
 */
async function updateEventModel(id, eventData) {
  const [result] = await pool.execute(
    `UPDATE event 
     SET title = ?, 
         description = ?, 
         date = ?, 
         duration = ?, 
         capacity = ?, 
         illustration = ?, 
         location = ?, 
         id_USER = ?
     WHERE id = ?`,
    [
      eventData.title ?? null,
      eventData.description ?? null,
      eventData.date ?? null,
      eventData.duration ?? null,
      eventData.capacity ?? null,
      eventData.illustration ?? null,
      eventData.location ?? null,
      eventData.id_USER ?? null,
      id,
    ]
  );

  return result.affectedRows; // retourne 1 si modifié, 0 si id inexistant
}

/**
 * Supprimer un événement
 */
async function deleteEventModel(id) {
  const [result] = await pool.execute(
    "DELETE FROM event WHERE id = ?",
    [id]
  );

  return result.affectedRows; // retourne 1 si supprimé
}





export {
  createEventModel,
  getAllEventsModel,
  getEventByIdModel,
  updateEventModel,
  deleteEventModel,
};
