import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID of the user creating the order' })
  userId: number;
}
