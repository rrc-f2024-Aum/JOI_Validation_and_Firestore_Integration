import Joi from "joi";

export const eventSchemas = {
    
    // POST - create new event
    create: {
        body: Joi.object({

            name: Joi.string().min(3).required().messages({
                'string.min': '"name" length must be atl east 3 characters long',
                'any.required': '"name" is required',
                'string.empty': '"name" cannot be empty'
            }),

            date: Joi.date().iso().greater('now').required().messages({
                'date.greater': '"date" must be greater than current date and time',
                'date.iso': '"date" must be valid ISO 8601 date string',
                'any.required': '"date" is required'
            }),

            capacity: Joi.number().integer().min(0).required().messages({
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
    }    



    // GET - single event by id
    // PUT - update event by id
    // DELETE - delete event by id
}