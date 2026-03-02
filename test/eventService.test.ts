import * as eventService from "../src/api/v1/services/eventService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";

jest.mock("../src/api/v1/repositories/firestoreRepository.ts");

describe("Event Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // For health check endpoint
    describe("getHealthStatus", () => {
        it("should return health status of the application", () => {

            const result = eventService.getHealthStatus();

            expect(result).toHaveProperty("status", "Ok");
            expect(result).toHaveProperty("uptime");
            expect(result).toHaveProperty("timestamp");
            expect(result).toHaveProperty("version", "1.0.0");
        });
    });

    // create event
    describe("createEvent", () => {
        it("should create event and return id", async () => {
            const mockSnapshot = { empty: true };
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);
            (firestoreRepository.createDocument as jest.Mock).mockResolvedValue("evt_000001");

            const eventData = {
                name: "Tech Conference",
                date: new Date(Date.now() + 86400000).toISOString(),
                capacity: 100
            };

            const result = await eventService.createEvent(eventData);

            expect(firestoreRepository.createDocument).toHaveBeenCalled();
            expect(result).toBe("evt_000001");
        });
    });

    // get all events
    describe("getAllEvents", () => {
        it("should return all events", async () => {
            const mockSnapshot = {
                forEach: jest.fn(callback => {
                    callback({ id: "evt_000001", data: () => ({ name: "Event 1", date: "2025-12-25T09:00:00.000Z", capacity: 100 }) });
                })
            };
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            const result = await eventService.getAllEvents();

            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("events");
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("evt_000001");
        });
    });


    // get event by id
    describe("getEventByID", () => {
        it("should return event when found", async () => {
            const mockDoc = {
                exists: true,
                id: "evt_000001",
                data: () => ({ name: "Event 1", date: "2025-12-25T09:00:00.000Z", capacity: 100 })
            };
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            const result = await eventService.getEventByID("evt_000001");

            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("events", "evt_000001");
            expect(result).not.toBeNull();
            expect(result?.id).toBe("evt_000001");
        });

        it("should return null when event not found", async () => {
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

            const result = await eventService.getEventByID("evt_999999");

            expect(result).toBeNull();
        });
    });


    // update event
    describe("updatedEvent", () => {
        it("should update event successfully", async () => {
            (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);

            const updateData = { name: "Updated Event" };

            await eventService.updatedEvent("evt_000001", updateData);

            expect(firestoreRepository.updateDocument).toHaveBeenCalledWith("events", "evt_000001", updateData);
        });
    });

    // delete event
    describe("deleteEvent", () => {
        it("should delete event successfully", async () => {
            (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

            await eventService.deleteEvent("evt_000001");

            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("events", "evt_000001");
        });
    });
});
