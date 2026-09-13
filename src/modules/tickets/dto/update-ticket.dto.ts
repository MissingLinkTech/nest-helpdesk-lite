import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTicketDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;
    @IsOptional()
    @IsIn(['low', 'medium', 'high'])
    priority?: 'low' | 'medium' | 'high';
}
