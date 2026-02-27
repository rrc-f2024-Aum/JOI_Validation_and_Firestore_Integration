import express from "express";
import { validateRequest } from "../middleware/validate";
import * as eventController from "../controllers/eventController";
import { eventSchemas } from "../validations/eventSchemas";

const router = express.Router();

// GET - all events
router.get("/",
    validateRequest(eventSchemas.list),
    eventController.getAllEventsHandler
);

//GET - event by id
router.get("/:id",
    validateRequest(eventSchemas.getById),
    eventController.getEventByIdHandler
);

//POST - create event
router.post("/",
    validateRequest(eventSchemas.create),
    eventController.createEventHandler
);

// PUT - update event 
router.put("/:id",
    validateRequest(eventSchemas.update),
    eventController.updateEventHandler
);

// DELETE - remove event
router.get("/:id",
    validateRequest(eventSchemas.getById),
    eventController.deleteEventHandler
);