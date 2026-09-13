import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TicketsModule } from './modules/tickets/tickets.module.js';

@Module({
  imports: [TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
