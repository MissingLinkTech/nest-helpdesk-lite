import { IsIn, IsOptional } from "class-validator";

export class FilterTicketQueryDto {
    @IsOptional()
    @IsIn(['open', 'closed', 'in-progress'])
    status?: 'open' | 'closed' | 'in-progress';
    @IsOptional()
    @IsIn(['low', 'medium', 'high'])
    priority?: 'low' | 'medium' | 'high';
}
