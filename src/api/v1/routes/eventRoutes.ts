import express from "express";
import { validateRequest } from "../middleware/validate";
import * as eventController from "../controllers/eventController";
import { eventSchemas } from "../validations/eventSchemas";
//import { getHealthStatus } from "../services/eventService";

const router = express.Router();
/**
* @openapi
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running properly
 *         content:
 *           application/json:
 *             schema: *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Ok"
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                   example: 123.45
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *       500:
 *         description: Server error
 */
// GET - health check
router.get("/health", 
    eventController.checkHealth)

/**
 * @openapi
 * /events:
 *   get:
 *     summary: Retrieve a list of all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch events"
 */    
// GET - all events
router.get("/events",
    validateRequest(eventSchemas.list),
    eventController.getAllEventsHandler
);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Retrieve a specific event by ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^evt_\d{6}$'
 *           example: "evt_000001"
 *         description: The unique identifier of the event (format: evt_######)
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *        404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch event evt_000001"
 */
//GET - event by id
router.get("/events/:id",
    validateRequest(eventSchemas.getById),
    eventController.getEventByIdHandler
);

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: Event name
 *                 example: "Tech Conference 2026"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 description: Detailed event description
 *                 example: "Annual technology conference with industry experts"
 *               date: 
 *                  type: string
 *                 format: date-time
 *                 description: Event date and time
 *                 example: "2026-12-15T14:00:00Z"
 *               location:
 *                 type: string
 *                 description: Event location
 *                 example: "Convention Center, Winnipeg"
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Maximum number of attendees
 *                 example: 100
 *               category:
 *                 type: string
 *                 description: Event category
 *                 enum: [general, conference, workshop, meetup]
 *                 default: general
 *                 example: "conference"
 *               status:
 *                 type: string
 *                 description: Event status
 *                 enum: [active, cancelled, completed]
 *                 default: active
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event created successfully"
 *                 id:
 *                   type: string
 *                   example: "evt_000001"
 *       400:
 *         description: Validation error - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create event"
 *       500:
 *         description: Server error
 */
//POST - create event
router.post("/events",
    validateRequest(eventSchemas.create),
    eventController.createEventHandler
);

/**
 * @openapi
 * /events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^evt_\d{6}$'
 *           example: "evt_000001"
 *         description: The unique identifier of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: Updated event name
 *                 example: "Updated Tech Conference 2026"
 *               description:
 *                  type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 description: Updated event description
 *                 example: "Updated description for the conference"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Updated event date
 *                 example: "2026-12-16T14:00:00Z"
 *               location:
 *                 type: string
 *                 description: Updated location
 *                 example: "New Convention Center"
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Updated capacity
 *                 example: 150
 *               category:
 *                 type: string
 *                 description: Updated category
 *                 enum: [general, conference, workshop, meetup]
 *               status:
 *                 type: string
 *                 description: Updated status
 *                 enum: [active, cancelled, completed]
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event updated successfully"
 *                 id:
 *                   type: string
 *                   example: "evt_000001"
 *       400:
 *         description: Validation error - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update event evt_000001"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Server error
 */
// PUT - update event 
router.put("/events/:id",
    validateRequest(eventSchemas.update),
    eventController.updateEventHandler
);

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^evt_\d{6}$'
 *           example: "evt_000001"
 *         description: The unique identifier of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *                 id:
 *                   type: string
 *                   example: "evt_000001"
 *       404:
 *          description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete event evt_000001"
 */
// DELETE - remove event
router.delete("/events/:id",
    validateRequest(eventSchemas.delete),
    eventController.deleteEventHandler
);

export default router;