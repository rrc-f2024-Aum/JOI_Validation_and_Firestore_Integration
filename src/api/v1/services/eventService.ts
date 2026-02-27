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
export const getEventByID = async (id: string): Promise<Event | null> => {
    try {
        const doc = await firestoreRepository.getDocumentById(COLLECTION_NAME, id);

        if (!doc) {
            return null;
        }

        return {
            id: doc.id,
            ...doc.data()
        } as Event;
    
    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message: "Unknown Error";
        throw new Error(`Failed to fetch event ${id}: ${errorMessage}`);
    }
}

// update event by ID
export const updatedEvent = async (
    id: string,
    eventData: Partial<Event>
): Promise<void> => {
    try {
        await firestoreRepository.updateDocument<Event>(
            COLLECTION_NAME,
            id,
            eventData
        );
    
    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message: "Unknown error";
        throw new Error(`Failed to update event ${id}: ${errorMessage}`);
    }
}

// delete event by ID
export const deleteEvent = async (id: string): Promise<void> => {
    try {
        await firestoreRepository.deleteDocument(COLLECTION_NAME, id);

    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message: "Unknown error";
        throw new Error(`Failed to delete Event ${id}: ${errorMessage}`);
    }
}