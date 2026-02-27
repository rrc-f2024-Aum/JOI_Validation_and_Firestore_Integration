import { Event } from "../models/eventModel";
import * as firestoreRepository from "../repositories/firestoreRepository";

const COLLECTION_NAME = "events";

export const createEvent = async(eventData: Partial<Event>): Promise<string> => {
   
    try {
        const eventId = await firestoreRepository.createDocument<Event>(
            COLLECTION_NAME, 
            eventData
        );

        return eventId;
    
    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message: "Unknown error";
        throw new Error(`Failed to create event: ${errorMessage}`);
    }
}