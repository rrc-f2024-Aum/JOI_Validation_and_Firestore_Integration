import { eventSchemas } from "../src/api/v1/validations/eventSchemas";

describe("Event Validation Schemas", () => {
    describe("Create Event Schemas", () => {
        const validEvent = {
            name: "Tech CollectionReference",
            date: new Date(Date.now() + 8640000).toISOString(),
            capacity: 100
        };

        // Required fields
        it("should return error when name is missing", () => {
            const invalidEvent = {
                date: validEvent.date,
                capacity: 100
            };

            const { error } = eventSchemas.create.body.validate(invalidEvent);

            expect(error).toBeDefined();
            expect(error?.details[0].message).toBe('"name" is required');
        });

        // Name length verification
        it("should return error when name is less than 3 characters", () => {
            const invalidEvent = {
                ...validEvent,
                name: "AB"
            };

            const { error } = eventSchemas.create.body.validate(invalidEvent);

            expect(error).toBeDefined();
            expect(error?.details[0].message).toBe('"name" length must be at least 3 characters long');
        });

        // Number range verification
        it("should return error when capacity is less than 5", () => {
            const invalidEvent = {
                ...validEvent,
                capacity: 4
            };

            const { error } = eventSchemas.create.body.validate(invalidEvent);

            expect(error).toBeDefined();
            expect(error?.details[0].message).toBe('"capacity" must be greater than or equal to 5');
        });


        // Date Validation
        it("should return error when date is in the past", () => {
            const invalidEvent = {
                ...validEvent,
                date: new Date(Date.now() - 86400000).toISOString() // yesterday
            };

            const { error } = eventSchemas.create.body.validate(invalidEvent);

            expect(error).toBeDefined();
            expect(error?.details[0].message).toBe('"date" must be greater than "now"');
        });

        // Valid event passes validation
        it("should validate a correct event", () => {
            const { error } = eventSchemas.create.body.validate(validEvent);

            expect(error).toBeUndefined();
        });
    });

    describe("Get By ID Schema", () => {
        // valid id format test case
        it("should validate correct ID format", () => {
            const { error } = eventSchemas.getById.params.validate({
                id: "evt_000001"
            });

            expect(error).toBeUndefined();
        });

        // invalid id format
        it("should return error for invalid ID format", () => {
            const { error } = eventSchemas.getById.params.validate({
                id: "evt_1"
            });

            expect(error).toBeDefined();
            expect(error?.details[0].message).toBe('"id" must be in format evt_000001');
        });


    })
})
