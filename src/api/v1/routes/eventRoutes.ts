import express from "express";
import { validateRequest } from "../middleware/validate";
import * as eventController from "../controllers/eventController";
import { eventSchemas } from "../validations/eventSchemas";
//import { getHealthStatus } from "../services/eventService";

const router = express.Router();

// GET - health check
router.get("/health", 
    eventController.checkHealth)

// GET - all events
router.get("/events",
    validateRequest(eventSchemas.list),
    eventController.getAllEventsHandler
);

//GET - event by id
router.get("/events/:id",
    validateRequest(eventSchemas.getById),
    eventController.getEventByIdHandler
);

//POST - create event
router.post("/events",
    validateRequest(eventSchemas.create),
    eventController.createEventHandler
);

// PUT - update event 
router.put("/events/:id",
    validateRequest(eventSchemas.update),
    eventController.updateEventHandler
);

// DELETE - remove event
router.delete("/events/:id",
    validateRequest(eventSchemas.delete),
    eventController.deleteEventHandler
);

export default router;