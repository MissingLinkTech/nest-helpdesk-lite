export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'closed' | 'in-progress';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
}
