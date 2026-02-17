const {
    createEventModel,
    getAllEventsModel,
    getEventByIdModel,
    updateEventModel,
    deleteEventModel,
  } = require("../models/event.model");
  
  /**
   * Créer un even
   */
  async function createEvent(req, res) {
    try {
      const eventId = await createEventModel(req.body);
  
      res.status(201).json({
        message: "Event créé avec succès",
        id: eventId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la création de l'event" });
    }
  }
  
  /**
   * Récupérer tous les events
   */
  async function getAllEvents(req, res) {
    try {
      const events = await getAllEventsModel();
      res.status(200).json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération des events" });
    }
  }
  
  /**
   * recuperer un événement par ID
   */
  async function getEventById(req, res) {
    try {
      const event = await getEventByIdModel(req.params.id);
  
      if (!event) {
        return res.status(404).json({ error: "Event non trouvé" });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
  
  /**
   * Mettre à jour un events
   */
  async function updateEvent(req, res) {
    try {
      const affectedRows = await updateEventModel(req.params.id, req.body);
  
      if (affectedRows === 0) {
        return res.status(404).json({ error: "Event non trouvé" });
      }
  
      res.status(200).json({ message: "Event mis à jour avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
  }
  
  /**
   * Supprimer un événement
   */
  async function deleteEvent(req, res) {
    try {
      const affectedRows = await deleteEventModel(req.params.id);
  
      if (affectedRows === 0) {
        return res.status(404).json({ error: "Event non trouvé" });
      }
  
      res.status(200).json({ message: "Event supprimé avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  }
  
  module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
  };
  