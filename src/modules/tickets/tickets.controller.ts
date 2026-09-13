import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { FilterTicketQueryDto } from './dto/filter-ticket-query.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { StaffGuard } from './guards/staff.guard.js';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}

    @Get()
    findAll(@Query() filters: FilterTicketQueryDto) {
        return this.ticketsService.findAll(filters.status, filters.priority);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ticketsService.findOne(id);
    }

    @Post()
    create(@Body() payload: CreateTicketDto) {
        return this.ticketsService.create(payload);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateTicketDto) {
        return this.ticketsService.update(id, payload);
    }

    @UseGuards(StaffGuard)
    @Patch(':id/close')
    closeTicket(@Param('id', ParseIntPipe) id: number) {
        return this.ticketsService.closeTicket(id);
    }
}
