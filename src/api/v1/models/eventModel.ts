export interface Event {
    id?: string,
    name: string,
    description?: string,
    date: string,
    capacity: number,
    registrationCount?: number;
    status?: 'active' | 'cancelled' | 'completed',
    category?: string,
    location?: string,
    createdAt?: string,
    updatedAt?: string
}