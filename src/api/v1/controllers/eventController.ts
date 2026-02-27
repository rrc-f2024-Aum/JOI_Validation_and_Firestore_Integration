import { Request, Response, NextFunction } from "express";
import * as eventService from "../services/eventService";
import { successResponse, errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "src/constants/httpsConstants";

const validateId = (req: Request, res: Response): string | null => {
    const { id } = req.params;
    
    if (Array.isArray(id)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse("Invalid event ID format")
        );
        return null;
    }
    
    return id;
}

const validateEventExists = async(id: string, res: Response): Promise<any | null> => {
    const event = await eventService.getEventByID(id);
    
    if (!event) {
        res.status(HTTP_STATUS.NOT_FOUND).json(
            errorResponse("Event not found")
        );
        return null;
    }
    
    return event;
};

export const createEventHandler = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
        try {
            const eventId = await eventService.createEvent(req.body);
            const newEvent = await eventService.getEventByID(eventId);

            res.status(HTTP_STATUS.CREATED).json(
                successResponse(newEvent, "Event created")
            );
        } catch (error: unknown) {
            next(error);
        }
}


export const getAllEventsHandler = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const events = await eventService.getAllEvents();

        res.status(HTTP_STATUS.OK).json(
            successResponse(events, "Events retrieved")
        );
    
    } catch (error: unknown) {
        next(error);
    }
}

export const getEventByIdHandler = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const id = validateId(req, res);
        if (!id) return;
        
        const event = await validateEventExists(id, res);
        if (!event) return;
        
        res.status(HTTP_STATUS.OK).json(
            successResponse(event, "Event retrieved")
        );
    } catch (error: unknown) {
        next(error);
    }
}

export const updateEventHandler = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const id = validateId(req, res);
        if (!id) return;
        
        const existingEvent = await validateEventExists(id, res);
        if (!existingEvent) return;
        
        await eventService.updatedEvent(id, req.body);
        const updatedEvent = await eventService.getEventByID(id);
        
        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedEvent, "Event updated")
        );
    } catch (error: unknown) {
        next(error);
    }
}

export const deleteEventHandler = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const id = validateId(req, res);
        if (!id) return;
        
        const existingEvent = await validateEventExists(id, res);
        if (!existingEvent) return;
        
        await eventService.deleteEvent(id);
        
        res.status(HTTP_STATUS.OK).json(
            successResponse(undefined, "Event deleted successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};