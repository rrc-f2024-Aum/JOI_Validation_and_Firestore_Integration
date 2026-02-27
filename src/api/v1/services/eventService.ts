import { Event } from "../models/eventModel";
import * as firestoreRepository from "../repositories/firestoreRepository";

const COLLECTION_NAME = "events";

// create event
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

// get all events
export const getAllEvents = async(): Promise<Event[]> => {
    try {
        const snapshot = await firestoreRepository.getDocuments(COLLECTION_NAME);

        const events: Event[] = [];
        snapshot.forEach((doc) => {
            events.push({
                id: doc.id,
                ...doc.data()
            } as Event);
        });

        return events;
    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message: "Unknown error";
        throw new Error(`Failed to fetch events: ${errorMessage}`);
    }

}
// get event by ID
// update event by ID
// delete event by ID