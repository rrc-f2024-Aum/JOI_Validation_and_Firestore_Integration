import Joi from "joi";
/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - capacity
 *       properties:
 *         id:
 *           type: string
 *           pattern: '^evt_\d{6}$'
 *           description: Unique event identifier
 *           example: "evt_000001"
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Event name/title
 *           example: "Annual Tech Conference"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Event date and time (must be in future)
 *           example: "2026-12-15T14:00:00Z"
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           description: Maximum number of attendees
 *           example: 100
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           description: Current number of registered attendees (defaults to 0)
 *           example: 45
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           default: active
 *           description: Current event status
 *           example: "active"
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           default: general
 *           description: Event category
 *           example: "conference"
 *         description:
 *           type: string
 *           description: Detailed event description
 *           example: "Join us for a day of learning and networking"
 *         location:
 *           type: string
 *           description: Event location/venue
 *           example: "Winnipeg Convention Centre"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the event was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the event was last updated
 *     
 *     Error:
 *       type: object
 *       required:
 *         - error
 *         - message
 *       properties:
 *         error:
 *           type: string
 *           description: Error type or code
 *           example: "VALIDATION_ERROR"
 *         message:
 *           type: string
 *           description: Human-readable error message
 *           example: "Validation failed"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *                field:
 *                 type: string
 *                 description: Field that caused the error
 *                 example: "email"
 *               issue:
 *                 type: string
 *                 description: Specific validation issue
 *                 example: "must be a valid email address"
 *           description: Detailed validation errors
 *     
 *     PaginatedEvents:
 *       type: object
 *       properties:
 *         events:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Event'
 *         total:
 *           type: integer
 *           description: Total number of events
 *           example: 25   
 */

export const eventSchemas = {

    // POST - create new event
    create: {
        body: Joi.object({

            name: Joi.string().min(3).required().messages({
                'string.min': '"name" length must be at least 3 characters long',
                'any.required': '"name" is required',
                'string.empty': '"name" cannot be empty'
            }),

            date: Joi.date().iso().greater('now').required().messages({
                'date.greater': '"date" must be greater than "now"',
                'date.iso': '"date" must be valid ISO 8601 date string',
                'any.required': '"date" is required'
            }),

            capacity: Joi.number().integer().min(5).required().messages({
                'number.base': '"capacity" must be a number',
                'number.integer': '"capacity" must be an integer',
                'number.min': '"capacity" must be greater than or equal to 5',
                'any.required': '"capacity" is required'
            }),

            registrationCount: Joi.number().integer().min(0).max(Joi.ref('capacity'))
                .optional().messages({
                    'number.base': '"registrationCount" must be a number',
                    'number.integer': '"registrationCount" must be a integer',
                    'number.min': '"registrationCount" must be greater than or equal to 0',
                    'number.max': '"registrationCount" must be less than or equal to ref:capacity'
                }),

            status: Joi.string().valid('active', 'cancelled', 'completed').optional().messages({
                'any.only': '"status" must be one of [active, cancelled, completed]'
            }),

            category: Joi.string().valid('conference', 'workshop', 'meetup', 'seminar', 'general')
                .optional().messages({
                    'any.optional': '"category" must be one of [conference, workshop, meetup, seminar, general]'
                }),

            description: Joi.string().optional().allow(''),
            location: Joi.string().optional().allow('')

        })
    },

    // GET - single event by id
    getById: {
        params: Joi.object({
            id: Joi.string().pattern(/^evt_\d{6}$/).required().messages({
                'string.pattern.base': '"id" must be in format evt_000001',
                'any.required': '"id" is required'
            })
        })
    },

    // PUT - update event by id
    update: {
        params: Joi.object({
            id: Joi.string().pattern(/^evt_\d{6}$/).required().messages({
                'string.pattern.base': '"id" must be in format evt_000001',
                'any.required': '"id" is required'
            })
        }),

        body: Joi.object({
            name: Joi.string().min(3).optional().messages({
                'string.min': '"name" length must be at least 3 characters long',
                'string.empty': '"name" cannot by empty'
            }),

            date: Joi.date().iso().greater('now').optional().messages({
                'date.greater': '"date" must be greater than current date and time',
                'date.iso': '"date" must be valid ISO 8601 date string'
            }),

            capacity: Joi.number().integer().min(5).optional().messages({
                'number.base': '"capacity" must be a number',
                'number.integer': '"capacity" must be an integer',
                'number.min': '"capacity" must be greater than or equal to 5'
            }),

            registrationCount: Joi.number().integer().min(0).max(Joi.ref('capacity'))
                .optional().messages({
                    'number.base': '"registrationCount" must be a number',
                    'number.integer': '"registrationCount" must be a integer',
                    'number.min': '"registrationCount" must be greater than or equal to 0',
                    'number.max': '"registrationCount" must be less than or equal to capacity'
                }),

            status: Joi.string().valid('active', 'cancelled', 'completed').optional().messages({
                'any.only': '"status" must be one of [active, cancelled, completed]'
            }),

            category: Joi.string().valid('conference', 'workshop', 'meetup', 'seminar', 'general')
                .optional().messages({
                    'any.optional': '"category" must be one of [conference, workshop, meetup, seminar, general]'
                }),

            description: Joi.string().optional().allow(''),
            location: Joi.string().optional().allow('')
        })
    },

    // DELETE - delete event by id
    delete: {
        params: Joi.object({
            id: Joi.string().pattern(/^evt_\d{6}$/).required().messages({
                'string.pattern.base': '"id" must be in format evt_000001',
                'any.required': '"id" is required'
            })
        })
    },

    // GET - displays all events
    list: {
        query: Joi.object({
            status: Joi.string().valid('active', 'cancelled', 'completed').optional(),
            category: Joi.string().valid('conference', 'workshop', 'meetup', 'seminar', 'general').optional(),
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            sortBy: Joi.string().valid('date', 'name', 'capacity', 'createdAt').default('date'),
            sortOrder: Joi.string().valid('asc', 'desc').default('asc')
        })
    }
};