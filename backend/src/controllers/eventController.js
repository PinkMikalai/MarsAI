import {
  createEventModel,
  getAllEventsModel,
  getEventByIdModel,
  updateEventModel,
  deleteEventModel,
} from "../models/eventModel.js";
import { deleteOldFile } from "../services/deleteFileService.js";

async function createEvent(req, res) {
  try {
    if (req.files && req.files.illustration) {
      req.body.illustration = req.files.illustration[0].filename;
    }

    const insertId = await createEventModel(req.body);

    if (insertId) {
      const newEvent = await getEventByIdModel(insertId);
      res.status(200).json({
        message: "event cree avec succes",
        event: newEvent,
        status: true,
      });
    } else {
      res.status(400).json({
        message: "erreur lors de la creation",
        status: false,
      });
    }
  } catch (error) {
    console.error("erreur createEvent:", error);
    res.status(500).json({
      message: "erreur lors de la creation de l'event",
      status: false,
      error: error.message,
    });
  }
}

async function getAllEvents(req, res) {
  try {
    const events = await getAllEventsModel();
    res.status(200).json({
      message: "events recuperes avec succes",
      events,
      status: true,
    });
  } catch (error) {
    console.error("erreur getAllEvents:", error);
    res.status(500).json({
      message: "erreur lors de la recup des events",
      status: false,
      error: error.message,
    });
  }
}

async function getEventById(req, res) {
  try {
    const event = await getEventByIdModel(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "event non trouvé",
        status: false,
      });
    }

    res.status(200).json({
      message: "event recup avec succes",
      event,
      status: true,
    });
  } catch (error) {
    console.error("erreur getEventById:", error);
    res.status(500).json({
      message: "erreur lors de la recuperation de l'event",
      status: false,
      error: error.message,
    });
  }
}

async function updateEvent(req, res) {
  try {
    const existingEvent = await getEventByIdModel(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({
        message: "event non trouve",
        status: false,
      });
    }

    const oldIllustrationFileName = existingEvent.illustration;

    if (req.files && req.files.illustration) {
      req.body.illustration = req.files.illustration[0].filename;
    }

    const result = await updateEventModel(req.params.id, req.body);

    if (result) {
      if (req.files && req.files.illustration && oldIllustrationFileName) {
        deleteOldFile(oldIllustrationFileName, "images");
      }

      const updatedEvent = await getEventByIdModel(req.params.id);
      res.status(200).json({
        message: "event mis a jour avec succes",
        event: updatedEvent,
        status: true,
      });
    } else {
      res.status(400).json({
        message: "aucune modification effectuee",
        status: false,
      });
    }
  } catch (error) {
    console.error("erreur updateEvent:", error);
    res.status(500).json({
      message: "erreur lors de la mise a jour de l'event",
      status: false,
      error: error.message,
    });
  }
}

async function deleteEvent(req, res) {
  try {
    const existingEvent = await getEventByIdModel(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({
        message: "event non trouve",
        status: false,
      });
    }

    const illustrationFileName = existingEvent.illustration;
    const result = await deleteEventModel(req.params.id);

    if (result) {
      if (illustrationFileName) {
        deleteOldFile(illustrationFileName, "images");
      }
      res.status(200).json({
        message: "event supprime avec succes",
        status: true,
      });
    } else {
      res.status(400).json({
        message: "aucune suppression effectuee",
        status: false,
      });
    }
  } catch (error) {
    console.error("erreur deleteEvent:", error);
    res.status(500).json({
      message: "erreur lors de la suppression de l'event",
      status: false,
      error: error.message,
    });
  }
}

export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
