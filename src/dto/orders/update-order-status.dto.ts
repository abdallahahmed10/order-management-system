import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'Completed', description: 'New status of the order' })
  status: string;
}