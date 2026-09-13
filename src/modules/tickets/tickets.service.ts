import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

@Injectable()
export class TicketsService {
    private readonly tickets: Ticket[] = [
        {
            id: 1,
            title: 'Unable to Login to Employee Portal',
            description: 'User is unable to log in to the employee portal even after resetting the password.',
            status: 'open',
            priority: 'high',
            createdAt: new Date().toISOString(),
        },
        {
            id: 2,
            title: 'Laptop Running Slow',
            description: 'User reports that the laptop has become very slow and frequently freezes while running multiple applications.',
            status: 'in-progress',
            priority: 'medium',
            createdAt: new Date().toISOString(),
        },
        {
            id: 3,
            title: 'Email Signature Update Request',
            description: 'User requested an update to their company email signature with the new job title and contact information.',
            status: 'closed',
            priority: 'low',
            createdAt: new Date().toISOString(),
        },
        {
            id: 4,
            title: 'VPN Connection Not Working',
            description: 'User is unable to connect to the company VPN and receives a connection timeout error.',
            status: 'open',
            priority: 'high',
            createdAt: new Date().toISOString(),
        }
    ];

    private nextTicketId = 5;

    findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
        let filteredTickets = this.tickets;
        if (status) {
            filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
        }
        if (priority) {
            filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
        }
        return filteredTickets;
    }

    findOne(id: number) {
        const ticket = this.tickets.find(ticket => ticket.id === id);
        if (!ticket) {
            throw new NotFoundException(`Ticket with ID ${id} not found`);
        }
        return ticket;
    }

    create(payload: CreateTicketDto) {
        const { priority, description, title } = payload;
        const ticket: Ticket = {
            id: this.nextTicketId++,
            status: 'open',
            priority,
            title,
            description,
            createdAt: new Date().toISOString()
        }
        this.tickets.push(ticket);
        return ticket;
    }

    update(id: number, payload: UpdateTicketDto) {
        const ticket = this.findOne(id);
        if (ticket.status === 'closed') {
            throw new BadRequestException('Closed ticket can not be updated.');
        }
        Object.assign(ticket, payload)
        return ticket;
    }

    closeTicket(id: number) {
        const findTicket = this.findOne(id);
        if (findTicket.status === 'closed') {
            throw new BadRequestException('Ticket is already closed.');
        }
        findTicket.status = 'closed';
        return findTicket;
    }
}
