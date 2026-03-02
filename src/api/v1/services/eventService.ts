import { Event } from "../models/eventModel";
import * as firestoreRepository from "../repositories/firestoreRepository";

// health check
export const getHealthStatus = () => {
    return {
        status: "Ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    }
}

const COLLECTION_NAME = "events";

// helper function to formate firestore data 
const formatEventData = (doc: FirebaseFirestore.DocumentSnapshot): Event => {
    const data = doc.data()!;

    const formatDate = (dateValue: any): string => {
        if (dateValue && typeof dateValue === 'object' && '_seconds' in dateValue) {
            return new Date(dateValue._seconds * 1000).toISOString();
        }

        return dateValue ? new Date(dateValue).toISOString(): new Date().toISOString();
    }
    return {
        id: doc.id,
        name: data.name,
        date: formatDate(data.date),
        capacity: data.capacity,
        registrationCount: data.registrationCount ?? 0,
        status: data.status ?? 'active',
        category: data.category ?? 'general',
        description: data.description,
        location: data.location,
        createdAt: formatDate(data.createdAt),
        updatedAt: formatDate(data.updatedAt)
    } as Event;
};

// create event
export const createEvent = async(eventData: Partial<Event>): Promise<string> => {
    try {
        const snapshot = await firestoreRepository.getDocuments(COLLECTION_NAME);

        let nextId = "evt_000001";
        if (!snapshot.empty) {
            const ids: number[] = [];
            snapshot.forEach(doc => {
                const match = doc.id.match(/evt_(\d+)/);
                if (match) {
                    ids.push(parseInt(match[1], 10));
                }
            });

            if (ids.length > 0) {
                const maxId = Math.max(...ids);
                const nextNumber = maxId + 1;
                nextId = `evt_${nextNumber.toString().padStart(6,"0")}`;
            }
        }

        const now = new Date().toISOString();
        const eventDataWithTime = {
            ...eventData,
            date: eventData.date ? new Date(eventData.date).toISOString(): undefined,
            registrationCount: eventData.registrationCount ?? 0,
            status: eventData.status ?? 'active',
            category: eventData.category ?? 'general',
            createdAt: now,
            updatedAt: now
        }

        const eventId = await firestoreRepository.createDocument<Event>(
            COLLECTION_NAME, 
            eventDataWithTime,
            nextId
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
            events.push(formatEventData(doc));
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

        return formatEventData(doc);
    
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