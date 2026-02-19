import {
  createEventModel,
  getAllEventsModel,
  getEventByIdModel,
  updateEventModel,
  deleteEventModel
} from "../../models/eventModel.js";


export async function createEventService(data) {
  const insertId = await createEventModel(data);
  if (!insertId) return null;

  return await getEventByIdModel(insertId);
}

export async function getAllEventsService() {
  return await getAllEventsModel();
}

export async function getEventByIdService(id) {
  return await getEventByIdModel(id);
}

export async function updateEventService(id, data) {
  const existing = await getEventByIdModel(id);
  if (!existing) return null;

  return await updateEventModel(id, data);
}

export async function deleteEventService(id) {
  const existing = await getEventByIdModel(id);
  if (!existing) return null;

  const ok = await deleteEventModel(id);
  if (!ok) return null;

  return true;
}
